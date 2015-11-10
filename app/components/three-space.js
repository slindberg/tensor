import React, { Component } from 'react'
import { Scene, PerspectiveCamera, AxisHelper } from 'react-three'
import THREE from 'three'
import Measure from 'react-measure'

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
    const axisSize = 300
    const cameraProps = {
      fov: 75,
      aspect: 1,
      near: 1,
      far: 5000,
      position: new THREE.Vector3(400, 400, 600),
      lookat: new THREE.Vector3(0, 0, 0),
    }

    return (
      <Measure
        whitelist={[ 'width', 'height' ]}
        onMeasure={(dimensions) => { this.setState({ dimensions })}}
      >
        <div>
          <Scene width={size} height={size} camera="maincamera" transparent={true}>
            <PerspectiveCamera name="maincamera" {...cameraProps} />
            <AxisHelper size={axisSize} />
          </Scene>
        </div>
      </Measure>
    )
  }
}
