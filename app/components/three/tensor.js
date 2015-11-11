import React, { Component } from 'react'
import { Object3D } from 'react-three'
import THREE from 'three'
import numeric from 'numeric'
import Cube from './cube'
import Vector from './vector'
import colors from '../../constants/colors'

export default class Tensor extends Component {
  render() {
    const { size } = this.props
    const vectorProps = this.buildVectors()
    const cubeProps = {
      position: new THREE.Vector3(0, 0, 0),
      size: size,
      color: colors.tensor,
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

  buildVectors() {
    const { value, size } = this.props
    const offset = size / 2
    const magnitude = size * 5 / 8
    let eigenValues

    try {
      eigenValues = numeric.eig(value)
    } catch (error) {
      console.debug('Invalid tensor, cannot find eigenvalues')

      return []
    }

    // Scale the vectors by the largest principle value
    const maxValue = Math.max(...numeric.abs(eigenValues.lambda.x))

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

    return [
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
  }
}
