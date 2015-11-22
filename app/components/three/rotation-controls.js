import React, { Component, PropTypes } from 'react'
import { Object3D, Mesh } from 'react-three'
import { Vector2, Vector3, Matrix4, Quaternion, Raycaster } from 'three'
import { Dispatcher } from 'flux'
import { createCircleGeometry, createMaterial } from '../../utils/three'
import PickerPlanes from './picker-planes'
import componentAngles from '../../utils/component-angles'
import scene from '../../constants/scene'
import geometry from '../../constants/geometry'
import colors from '../../constants/colors'

const planes = {
  X: {
    color: colors.xAxis,
    normal: new Vector3(1, 0, 0),
  },
  Y: {
    color: colors.yAxis,
    normal: new Vector3(0, 1, 0),
  },
  Z: {
    color: colors.zAxis,
    normal: new Vector3(0, 0, 1),
  },
}

const propTypes = {
  cameraName: PropTypes.string.isRequired,
  cameraPosition: PropTypes.instanceOf(Vector3).isRequired,
  rotation: PropTypes.instanceOf(Matrix4).isRequired,
  dispatcher: PropTypes.instanceOf(Dispatcher).isRequired,
}

export default class RotationControls extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      activePlane: null,
    }

    this.isRotating = false

    // Reusable THREE objects
    this.pointerPosition = new Vector2()
    this.raycaster = new Raycaster()
    this.referenceQuaternion = new Quaternion()
    this.deltaQuaternion = new Quaternion()
    this.eyeAxis = new Vector3()

    // Internal state
    this.referenceRotation = new Matrix4()
    this.referencePosition = new Vector3()
    this.offsetPosition = new Vector3()
    this.offsetAngles = new Vector3()
    this.moveDirection  = new Vector3()

    props.dispatcher.register(payload => this.handlePointerEvent(payload))
  }

  getCamera() {
    const { object } = this.refs
    const { cameraName } = this.props
    // This is super brittle, but there are limited options
    const scene = object.parent

    return scene.getObjectByName(cameraName, true)
  }

  handlePointerEvent(event) {
    const { eventName, coordinates } = event
    const { pointerPosition } = this

    pointerPosition.set(...coordinates)

    if (eventName === 'mouseUp' || eventName === 'mouseOut') {
      this.isRotating = false
      if (eventName === 'mouseOut') {
        this.setActivePlane(null)
      } else {
        this.setReferencePoint(pointerPosition)
      }
    } else {
      if (!this.isRotating) {
        this.setReferencePoint(pointerPosition)
      }

      if (eventName === 'mouseDown') {
        this.isRotating = true
      }

      this.setPlaneOffset(pointerPosition)
    }

    if (this.isRotating) {
      this.updateRotation()
    }
  }

  setReferencePoint(pointer) {
    const intersection = this.findIntersection(pointer)

    if (intersection) {
      this.referencePosition.copy(intersection.point)
      this.referenceRotation.getInverse(this.props.rotation)

      this.setActivePlane(intersection.object.name)
    }
  }

  setActivePlane(activePlane) {
    this.setState({ activePlane })
  }

  setPlaneOffset(pointer) {
    const { referencePosition, offsetPosition, offsetAngles, moveDirection } = this
    const { activePlane } = this.state
    const intersection = this.findIntersection(pointer, activePlane)

    if (intersection) {
      offsetPosition.copy(intersection.point)
      offsetAngles.subVectors(componentAngles(referencePosition), componentAngles(offsetPosition))
      moveDirection.subVectors(offsetPosition, referencePosition)
    }
  }

  findIntersection(coordinates, planeName) {
    const { raycaster } = this
    const camera = this.getCamera()
    const objectName = planeName || 'pickers'
    const object = this.refs.object.getObjectByName(objectName)

    raycaster.setFromCamera(coordinates, camera)

    const intersections = raycaster.intersectObject(object, true)

    return intersections[0]
  }

  updateRotation() {
    const { referenceQuaternion, deltaQuaternion, offsetAngles, moveDirection, eyeAxis } = this
    const { cameraPosition } = this.props
    const { activePlane } = this.state
    let axis, angle

    if (activePlane === 'E') {
      axis = eyeAxis.crossVectors(moveDirection, cameraPosition).normalize()
      angle = offsetAngles.length()
    } else {
      axis = planes[activePlane].normal
      angle = offsetAngles[activePlane.toLowerCase()]
    }

    referenceQuaternion.setFromRotationMatrix(this.referenceRotation)
    deltaQuaternion.setFromAxisAngle(axis, angle)

    referenceQuaternion.multiply(deltaQuaternion)

    this.props.onRotate(referenceQuaternion)
  }

  render() {
    const { activePlane } = this.state
    const { cameraPosition } = this.props
    const planeNames = Object.keys(planes)
    let activePlaneObject

    if (~planeNames.indexOf(activePlane)) {
      const activePlaneProps = {
        position: new Vector3(0, 0, 0),
        geometry: createCircleGeometry(geometry.visualPlaneRadius),
        material: createMaterial(planes[activePlane].color, scene.planeOpacity),
      }

      activePlaneProps.geometry.lookAt(planes[activePlane].normal)

      activePlaneObject = <Mesh {...activePlaneProps} />
    }

    return (
      <Object3D ref="object">
        <PickerPlanes ref="pickers" cameraPosition={cameraPosition} />
        {activePlaneObject}
      </Object3D>
    )
  }
}

RotationControls.propTypes = propTypes
