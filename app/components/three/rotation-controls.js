import React, { Component } from 'react'
import { Object3D, Mesh } from 'react-three'
import THREE, { Vector2, Vector3, Matrix4, Quaternion, Raycaster } from 'three'
import scene from '../../constants/scene'
import geometry from '../../constants/geometry'
import colors from '../../constants/colors'

const planeNames = [ 'X', 'Y', 'Z' ]

const unitAxes = {
  X: new Vector3(1, 0, 0),
  Y: new Vector3(0, 1, 0),
  Z: new Vector3(0, 0, 1),
}

const complementaryDirections = {
  X: [ 'z', 'y' ],
  Y: [ 'x', 'z' ],
  Z: [ 'y', 'x' ],
}

const planeSize = scene.cameraRange[1]
const planeGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize)

const planeQuaternions = {
  X: new Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
  Y: new Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
  Z: new Quaternion(),
}

const planeColors = {
  X: colors.xAxis,
  Y: colors.yAxis,
  Z: colors.zAxis,
}

function createPlaneMaterial(planeName, isVisible) {
  let options

  if (isVisible) {
    options = {
      color: planeColors[planeName],
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    }
  } else {
    options = {
      visible: false,
      side: THREE.DoubleSide,
    }
  }

  return new THREE.MeshBasicMaterial(options)
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

    // Internal state
    this.referenceRotation = new Matrix4()
    this.referencePosition = new Vector3()
    this.offsetPosition = new Vector3()

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
    const { activePlane } = this.state
    const intersection = this.findIntersection(pointer, activePlane)

    if (intersection) {
      this.offsetPosition.copy(intersection.point)
    }
  }

  findIntersection(coordinates, planeName) {
    const { raycaster } = this
    const camera = this.getCamera()
    let { object } = this.refs

    raycaster.setFromCamera(coordinates, camera)

    if (planeName) {
      object = this.refs[planeName]
    }

    const intersections = raycaster.intersectObject(object, true)

    return intersections[0]
  }

  updateRotation() {
    const { referenceQuaternion, deltaQuaternion } = this
    const { activePlane } = this.state
    const angle = this.angleForPlane(activePlane)
    const axis = unitAxes[activePlane]

    referenceQuaternion.setFromRotationMatrix(this.referenceRotation)
    deltaQuaternion.setFromAxisAngle(axis, angle)

    referenceQuaternion.multiply(deltaQuaternion)

    this.props.onChange(referenceQuaternion)
  }

  angleForPlane(planeName) {
    const { referencePosition, offsetPosition } = this
    const [ dir1, dir2 ] = complementaryDirections[planeName]
    const offsetAngle = Math.atan2(offsetPosition[dir1], offsetPosition[dir2])
    const referenceAngle = Math.atan2(referencePosition[dir1], referencePosition[dir2])

    return referenceAngle - offsetAngle
  }

  render() {
    const { activePlane } = this.state
    const pickerPlaneProps = planeNames.map((name) => {
      return {
        name,
        geometry: planeGeometry,
        material: createPlaneMaterial(name, false),
        quaternion: planeQuaternions[name],
      }
    })
    const visualPlaneProps = planeNames.map((name) => {
      return {
        name: name + '_visual',
        geometry: planeGeometry,
        material: createPlaneMaterial(name, name === activePlane),
        quaternion: planeQuaternions[name],
        scale: geometry.visualPlaneScale,
      }
    })

    return (
      <Object3D ref="object">
        {pickerPlaneProps.map(props => <Mesh key={props.name} ref={props.name} {...props} />)}
        {visualPlaneProps.map(props => <Mesh key={props.name} {...props} />)}
      </Object3D>
    )
  }
}
