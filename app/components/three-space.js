import React, { Component } from 'react'
import { Scene, PerspectiveCamera, AmbientLight, DirectionalLight, AxisHelper } from 'react-three'
import THREE from 'three'
import Measure from 'react-measure'
import Tensor from './three/tensor'
import colors from '../constants/colors'

export default class ThreeSpace extends Component {
  constructor() {
    super()

    this.state = {
      dimensions: {
        width: 0,
        height: 0,
      },
    }
  }

  render() {
    const { width, height } = this.state.dimensions
    const size = Math.min(width, height)
    const axisSize = 500
    const tensorSize = 300
    const cameraProps = {
      fov: 75,
      aspect: 1,
      near: 1,
      far: 5000,
      position: new THREE.Vector3(300, 300, 400),
      lookat: new THREE.Vector3(0, 0, 0),
    }
    const lightProps = {
      intensity: 0.7,
      position: new THREE.Vector3(17, 9, 30),
    }

    return (
      <Measure
        whitelist={[ 'width', 'height' ]}
        onMeasure={(dimensions) => { this.setState({ dimensions })}}
      >
        <div>
          <Scene width={size} height={size} camera="maincamera" transparent={true}>
            <PerspectiveCamera name="maincamera" {...cameraProps} />
            <AmbientLight color={colors.ambientLight} />
            <DirectionalLight color={colors.directionalLight} {...lightProps} />
            <AxisHelper size={axisSize} />
            <Tensor size={tensorSize} />
          </Scene>
        </div>
      </Measure>
    )
  }
}
