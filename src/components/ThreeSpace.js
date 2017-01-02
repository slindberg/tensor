import React, { Component, PropTypes } from 'react'
import { Renderer, PerspectiveCamera, AmbientLight, DirectionalLight, AxisHelper } from 'react-three'
import { Vector3, Matrix3, Matrix4, Quaternion } from 'three'
import { Dispatcher } from 'flux'
import Measure from 'react-measure'
import PointerEventScene from './three/PointerEventScene'
import RotationControls from './three/RotationControls'
import Tensor from './three/Tensor'
import update from 'react-addons-update'
import { matrixType, vectorType } from '../utils/prop-types'
import restructureMatrix from '../utils/restructure-matrix'
import colors from '../constants/colors'
import scene from '../constants/scene'
import geometry from '../constants/geometry'
import '../styles/visualization.css'

const propTypes = {
  onRotate: PropTypes.func.isRequired,
  tensor: matrixType,
  principleValues: vectorType,
  rotationMatrix: matrixType,
}

export default class ThreeSpace extends Component {
  constructor() {
    super()

    this.state = {
      dimensions: {
        width: 0,
        height: 0,
      },
      cameraPosition: new Vector3(...scene.cameraPosition),
      isRotating: false,
      dispatcher: new Dispatcher(),
    }

    this.normalMatrix = new Matrix3()
    this.rotationMatrix = new Matrix4()
    this.quaternion = new Quaternion()
  }

  updateIsRotating(isRotating) {
    this.setState(update(this.state, {
      isRotating: { '$set': isRotating },
    }))
  }

  updateRotation(quaternion) {
    const { normalMatrix, rotationMatrix } = this

    // Create a 4x4 matrix from the quaternion
    rotationMatrix.makeRotationFromQuaternion(quaternion)

    // Extract just the rotation component (3x3)
    normalMatrix.getNormalMatrix(rotationMatrix)

    // Create a structured matrix from the flat array that THREE uses
    const structuredMatrix = restructureMatrix(normalMatrix.toArray())

    this.props.onRotate(structuredMatrix)
  }

  render() {
    const { tensor, principleValues, rotationMatrix } = this.props
    const { dimensions, cameraPosition, isRotating, dispatcher } = this.state
    const { width, height } = dimensions
    const size = Math.min(width, height)

    // Convert the 3x3 structured rotation matrix into a THREE 4x4 matrix
    this.rotationMatrix.set(
      rotationMatrix[0][0], rotationMatrix[0][1], rotationMatrix[0][2], 0,
      rotationMatrix[1][0], rotationMatrix[1][1], rotationMatrix[1][2], 0,
      rotationMatrix[2][0], rotationMatrix[2][1], rotationMatrix[2][2], 0,
      0, 0, 0, 1
    )

    const controlProps = {
      cameraName: 'maincamera',
      cameraPosition,
      rotation: this.rotationMatrix,
      dispatcher,
    }
    const rendererProps = {
      width: size,
      height: size,
      transparent: true,
    }
    const sceneProps = {
      width: size,
      height: size,
      camera: 'maincamera',
      dispatcher,
    }
    const cameraProps = {
      name: 'maincamera',
      fov: scene.fieldOfView,
      aspect: scene.aspectRatio,
      near: scene.cameraRange[0],
      far: scene.cameraRange[1],
      position: cameraPosition,
      lookat: new Vector3(...scene.lookAtPosition),
    }
    const lightProps = {
      intensity: scene.lightIntensity,
      position: new Vector3(...scene.lightPosition),
    }
    const tensorProps = {
      value: tensor,
      principleValues,
      position: new Vector3(...geometry.tensorPosition),
      size: geometry.tensorSize,
      quaternion: this.quaternion.setFromRotationMatrix(this.rotationMatrix),
    }

    return (
      <Measure
        whitelist={[ 'width', 'height' ]}
        onMeasure={(dimensions) => { this.setState({ dimensions })}}>
        <div className={isRotating ? 'rotating' : 'static' }>
          <Renderer {...rendererProps}>
            <PointerEventScene {...sceneProps}>
              <PerspectiveCamera {...cameraProps} />
              <AmbientLight color={colors.ambientLight} />
              <DirectionalLight color={colors.directionalLight} {...lightProps} />
              <AxisHelper size={geometry.axisSize} />
              <Tensor {...tensorProps} />
              <RotationControls {...controlProps}
                onRotate={this.updateRotation.bind(this)}
                onIsRotating={this.updateIsRotating.bind(this)} />
            </PointerEventScene>
          </Renderer>
        </div>
      </Measure>
    )
  }
}

ThreeSpace.propTypes = propTypes