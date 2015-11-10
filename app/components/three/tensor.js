import React, { Component } from 'react'
import { Object3D } from 'react-three'
import THREE from 'three'
import Cube from './cube'
import colors from '../../constants/colors'

export default class Tensor extends Component {
  render() {
    const cubeProps = {
      position: new THREE.Vector3(0, 0, 0),
      size: this.props.size,
      color: colors.tensor,
    }

    return (
      <Object3D>
        <Cube {...cubeProps} />
      </Object3D>
    )
  }
}
