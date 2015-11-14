import React, { Component } from 'react'
import { Scene, PerspectiveCamera, AmbientLight, DirectionalLight, AxisHelper } from 'react-three'
import { Vector3, Quaternion } from 'three'
import Measure from 'react-measure'
import RotationControls from './three/rotation-controls'
import Tensor from './three/tensor'
import colors from '../constants/colors'

const cameraPosition = new Vector3(400, 400, 600)

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
    const axisSize = 500
    const tensorSize = 300
    const controlProps = {
      cameraPosition,
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
      fov: 75,
      aspect: 1,
      near: 1,
      far: 1500,
      position: cameraPosition,
      lookat: new Vector3(0, 0, 0),
    }
    const lightProps = {
      intensity: 0.7,
      position: new Vector3(17, 9, 30),
    }
    const tensorProps = {
      value: tensor,
      size: tensorSize,
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
            <AxisHelper size={axisSize} />
            <Tensor {...tensorProps} />
          </Scene>
        </RotationControls>
      </Measure>
    )
  }
}
