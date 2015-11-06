import React, { Component } from 'react'
import { Scene, PerspectiveCamera, AxisHelper } from 'react-three'
import THREE from 'three'
import Measure from 'react-measure'

export default class ThreeSpace extends Component {
  constructor() {
    super()

    this.state = { size: 0 }
  }

  render() {
    const { size } = this.state
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
        whitelist={[ 'width' ]}
        onMeasure={(dimensions) => { this.setState({ size: dimensions.width })}}
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
