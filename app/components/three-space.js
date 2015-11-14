import React, { Component } from 'react'
import { Scene, PerspectiveCamera, AmbientLight, DirectionalLight, AxisHelper } from 'react-three'
import { Vector3, Quaternion } from 'three'
import Measure from 'react-measure'
import RotationControls from './three/rotation-controls'
import Tensor from './three/tensor'
import colors from '../constants/colors'
import scene from '../constants/scene'
import geometry from '../constants/geometry'

export default class ThreeSpace extends Component {
  constructor() {
    super()

    this.state = {
      dimensions: {
        width: 0,
        height: 0,
      },
      quaternion: new Quaternion(),
    }
  }

  updateQuaternion(value) {
    this.state.quaternion = value
    this.setState(this.state)
  }

  render() {
    const { quaternion } = this.state
    const { tensor } = this.props
    const { width, height } = this.state.dimensions
    const size = Math.min(width, height)
    const controlProps = {
      quaternion,
    }
    const sceneProps = {
      width: size,
      height: size,
      transparent: true,
      camera: 'maincamera',
    }
    const cameraProps = {
      name: 'maincamera',
      fov: scene.fieldOfView,
      aspect: scene.aspectRatio,
      near: scene.cameraRange[0],
      far: scene.cameraRange[1],
      position: new Vector3(...scene.cameraPosition),
      lookat: new Vector3(...scene.lookAtPosition),
    }
    const lightProps = {
      intensity: scene.lightIntensity,
      position: new Vector3(...scene.lightPosition),
    }
    const tensorProps = {
      value: tensor,
      position: new Vector3(...geometry.tensorPosition),
      size: geometry.tensorSize,
      quaternion: quaternion,
    }

    return (
      <Measure
        whitelist={[ 'width', 'height' ]}
        onMeasure={(dimensions) => { this.setState({ dimensions })}}>
        <RotationControls onChange={this.updateQuaternion.bind(this)} {...controlProps}>
          <Scene {...sceneProps}>
            <PerspectiveCamera {...cameraProps} />
            <AmbientLight color={colors.ambientLight} />
            <DirectionalLight color={colors.directionalLight} {...lightProps} />
            <AxisHelper size={geometry.axisSize} />
            <Tensor {...tensorProps} />
          </Scene>
        </RotationControls>
      </Measure>
    )
  }
}
