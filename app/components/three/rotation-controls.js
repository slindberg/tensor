import React, { Component, PropTypes } from 'react'
import { Object3D, Mesh } from 'react-three'
import { Vector2, Vector3, Matrix4, Quaternion, Raycaster } from 'three'
import { Dispatcher } from 'flux'
import { createCircleGeometry, createMaterial } from '../../utils/three'
import PickerPlanes from './picker-planes'
import { unitNormalMap } from '../../utils/unit-normals'
import componentAngles from '../../utils/component-angles'
import scene from '../../constants/scene'
import geometry from '../../constants/geometry'
import colors from '../../constants/colors'

const propTypes = {
  cameraName: PropTypes.string.isRequired,
  cameraPosition: PropTypes.instanceOf(Vector3).isRequired,
  rotation: PropTypes.instanceOf(Matrix4).isRequired,
  dispatcher: PropTypes.instanceOf(Dispatcher).isRequired,
}

export default class RotationControls extends Component {
  constructor(props, context) {
    super(props, context)

    // Changing the active plane is the only thing that should trigger a rerender
    this.state = {
      activePlane: null,
    }

    // Reusable THREE objects
    this.pointerPosition = new Vector2()
    this.raycaster = new Raycaster()
    this.referenceQuaternion = new Quaternion()
    this.deltaQuaternion = new Quaternion()
    this.eyeAxis = new Vector3()
    this.unitNormals = unitNormalMap()

    // Internal state
    this.isRotating = false
    this.referenceRotation = new Matrix4()
    this.referencePosition = new Vector3()
    this.offsetPosition = new Vector3()
    this.offsetAngles = new Vector3()
    this.moveDirection  = new Vector3()

    props.dispatcher.register(payload => this.handlePointerEvent(payload))
  }

  getScene() {
    const { object } = this.refs

    function findRoot(object) {
      return object.parent ? findRoot(object.parent) : object
    }

    return findRoot(object)
  }

  getCamera() {
    const { cameraName } = this.props
    const scene = this.getScene()

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

      if (this.isRotating) {
        this.setOffsetPoint(pointerPosition)
      }
    }

    if (this.isRotating) {
      this.updateRotation()
    }
  }

  setActivePlane(activePlane) {
    this.setState({ activePlane })
  }

  setReferencePosition(position) {
    const { referencePosition, referenceRotation } = this

    // When the reference position changes, capture the reference rotation as well
    referencePosition.copy(position)
    referenceRotation.getInverse(this.props.rotation)
  }

  setReferencePoint(pointer) {
    const intersection = this.findIntersection(pointer)

    if (intersection) {
      this.setReferencePosition(intersection.point)
      this.setActivePlane(intersection.object.name)
    }
  }

  setOffsetPoint(pointer) {
    const { referencePosition, offsetPosition, offsetAngles, moveDirection } = this
    const { activePlane } = this.state
    const intersection = this.findIntersection(pointer, activePlane)

    if (intersection) {
      offsetPosition.copy(intersection.point)
      offsetAngles.subVectors(componentAngles(referencePosition), componentAngles(offsetPosition))
      moveDirection.subVectors(offsetPosition, referencePosition)

      // For free-rotation, treat individual movements as separate to allow
      // rotation about the camera axis
      if (activePlane === 'E') {
        this.setReferencePosition(offsetPosition)
      }
    }
  }

  findIntersection(coordinates, planeName) {
    const { raycaster } = this
    const camera = this.getCamera()
    const objectName = planeName ? 'planes' : 'pickers'
    let object = this.refs.object.getObjectByName(objectName)

    if (planeName) {
      object = object.getObjectByName(planeName)
    }

    raycaster.setFromCamera(coordinates, camera)

    const intersections = raycaster.intersectObject(object, true)

    return intersections[0]
  }

  updateRotation() {
    const { unitNormals, offsetAngles, moveDirection, eyeAxis, referenceQuaternion, deltaQuaternion } = this
    const { cameraPosition } = this.props
    const { activePlane } = this.state
    let axis, angle

    // The free-rotation axis is dependent on the movement direction
    if (activePlane === 'E') {
      axis = eyeAxis.crossVectors(moveDirection, cameraPosition).normalize()
      angle = offsetAngles.length()
    } else {
      axis = unitNormals[activePlane]
      angle = offsetAngles[activePlane.toLowerCase()]
    }

    // Avoid infinitesmal rotations
    if (Math.abs(angle) > scene.rotationThreshold) {
      referenceQuaternion.setFromRotationMatrix(this.referenceRotation)
      deltaQuaternion.setFromAxisAngle(axis, angle)

      referenceQuaternion.multiply(deltaQuaternion)

      this.props.onRotate(referenceQuaternion)
    }
  }

  render() {
    const { unitNormals } = this
    const { activePlane } = this.state
    const { cameraPosition } = this.props
    let activePlaneObject

    // Only display the active plane for axis normals
    if (~'XYZ'.indexOf(activePlane)) {
      const activePlaneProps = {
        position: new Vector3(0, 0, 0),
        geometry: createCircleGeometry(geometry.visualPlaneRadius, unitNormals[activePlane]),
        material: createMaterial(colors.axis[activePlane], scene.planeOpacity),
      }

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
