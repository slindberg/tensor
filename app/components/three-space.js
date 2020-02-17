import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Scene, PerspectiveCamera, AmbientLight, DirectionalLight, AxisHelper } from 'react-three'
import { Vector3, Matrix3, Matrix4, Quaternion } from 'three'
import { Dispatcher } from 'flux'
import Measure from 'react-measure'
import PointerEventRenderer from './three/pointer-event-renderer'
import RotationControls from './three/rotation-controls'
import Tensor from './three/tensor'
import update from 'react-addons-update'
import { matrixType, vectorType } from '../utils/prop-types'
import restructureMatrix from '../utils/restructure-matrix'
import styles from '../styles/visualization'
import colors from '../constants/colors'
import scene from '../constants/scene'
import geometry from '../constants/geometry'

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
    const sizeProps = {
      width: size,
      height: size,
    }
    const renderProps = {
      ...sizeProps,
      transparent: true,
      dispatcher,
    }
    const sceneProps = {
      ...sizeProps,
      camera: 'maincamera',
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
        bounds
        onResize={contentRect => { this.setState({ dimensions: contentRect.bounds })}}>
        {({ measureRef }) => (
          <div ref={measureRef} className={ isRotating ? styles.rotating : styles.static }>
            <PointerEventRenderer {...renderProps}>
              <Scene {...sceneProps}>
                <PerspectiveCamera {...cameraProps} />
                <AmbientLight color={colors.ambientLight} />
                <DirectionalLight color={colors.directionalLight} {...lightProps} />
                <AxisHelper size={geometry.axisSize} />
                <Tensor {...tensorProps} />
                <RotationControls {...controlProps}
                  onRotate={this.updateRotation.bind(this)}
                  onIsRotating={this.updateIsRotating.bind(this)} />
              </Scene>
            </PointerEventRenderer>
          </div>
        )}
      </Measure>
    )
  }
}

ThreeSpace.propTypes = propTypes
