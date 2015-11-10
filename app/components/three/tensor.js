import React, { Component } from 'react'
import { Object3D } from 'react-three'
import THREE from 'three'
import Cube from './cube'
import Vector from './vector'
import colors from '../../constants/colors'

export default class Tensor extends Component {
  render() {
    const { value, size } = this.props
    const offset = size / 2
    const magnitude = size * 5 / 8
    const cubeProps = {
      position: new THREE.Vector3(0, 0, 0),
      size: size,
      color: colors.tensor,
    }

    // TODO: this is an arbitrary number that is used to scale tensor component
    // magnitudes in order to visually scale vectors. It needs to be the
    // largest eigen value of the matrix
    const maxValue = 100

    const vectorProps = [
      buildVector('x', 'x', value[0][0]),
      buildVector('x', 'y', value[0][1]),
      buildVector('x', 'z', value[0][2]),
      buildVector('y', 'x', value[1][0]),
      buildVector('y', 'y', value[1][1]),
      buildVector('y', 'z', value[1][2]),
      buildVector('z', 'x', value[2][0]),
      buildVector('z', 'y', value[2][1]),
      buildVector('z', 'z', value[2][2]),
    ]

    function buildVector(face, orientation, value) {
      const faceIndex = 'xyz'.indexOf(face)
      const orientationIndex = 'xyz'.indexOf(orientation)
      const direction = [ 0, 0, 0 ]
      const position = [ 0, 0, 0 ]
      const scale = value / maxValue
      let color

      // The direction is the same for in-plane and normal vectors
      direction[orientationIndex] = 1

      // But the position/color is different
      if (face === orientation) {
        position[orientationIndex] = offset
        color = colors.normalVector
      } else {
        position[faceIndex] = offset + offset * 0.15
        position[orientationIndex] = -(magnitude * scale) / 2
        color = colors.inPlaneVector
      }

      return {
        key: face + orientation,
        direction: new THREE.Vector3(...direction),
        position: new THREE.Vector3(...position),
        magnitude,
        scale,
        color,
      }
    }

    return (
      <Object3D>
        <Cube {...cubeProps} />
        {vectorProps.map((props) => {
          return <Vector key={props.key} {...props} />
        })}
      </Object3D>
    )
  }
}
