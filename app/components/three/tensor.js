import React, { Component } from 'react'
import { Object3D } from 'react-three'
import THREE from 'three'
import Cube from './cube'
import Vector from './vector'
import colors from '../../constants/colors'

export default class Tensor extends Component {
  render() {
    const { size } = this.props
    const cubeProps = {
      position: new THREE.Vector3(0, 0, 0),
      size: size,
      color: colors.tensor,
    }

    const vectors = [
      // x, x
      {
        direction: new THREE.Vector3(1, 0, 0),
        position: new THREE.Vector3(size / 2, 0, 0),
        magnitude: size / 2,
        color: colors.normalVector,
      },
      // x, y
      {
        direction: new THREE.Vector3(0, 1, 0),
        position: new THREE.Vector3(size / 2 + 20, -size / 4, 0),
        magnitude: size / 2,
        color: colors.inPlaneVector,
      },
      // x, z
      {
        direction: new THREE.Vector3(0, 0, 1),
        position: new THREE.Vector3(size / 2 + 20, 0, -size / 4),
        magnitude: size / 2,
        color: colors.inPlaneVector,
      },
      // y, x
      {
        direction: new THREE.Vector3(1, 0, 0),
        position: new THREE.Vector3(-size / 4, size / 2 + 20, 0),
        magnitude: size / 2,
        color: colors.inPlaneVector,
      },
      // y, y
      {
        direction: new THREE.Vector3(0, 1, 0),
        position: new THREE.Vector3(0, size / 2, 0),
        magnitude: size / 2,
        color: colors.normalVector,
      },
      // y, z
      {
        direction: new THREE.Vector3(0, 0, 1),
        position: new THREE.Vector3(0, size / 2 + 20, -size / 4),
        magnitude: size / 2,
        color: colors.inPlaneVector,
      },
      // z, x
      {
        direction: new THREE.Vector3(1, 0, 0),
        position: new THREE.Vector3(-size / 4, 0, size / 2 + 20),
        magnitude: size / 2,
        color: colors.inPlaneVector,
      },
      // z, y
      {
        direction: new THREE.Vector3(0, 1, 0),
        position: new THREE.Vector3(0, -size / 4, size / 2 + 20),
        magnitude: size / 2,
        color: colors.inPlaneVector,
      },
      // z, z
      {
        direction: new THREE.Vector3(0, 0, 1),
        position: new THREE.Vector3(0, 0, size / 2),
        magnitude: size / 2,
        color: colors.normalVector,
      },
    ]

    return (
      <Object3D>
        <Cube {...cubeProps} />
        {vectors.map((vectorProps, index) => {
          return <Vector key={index} {...vectorProps} />
        })}
      </Object3D>
    )
  }
}
