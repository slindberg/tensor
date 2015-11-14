import React, { Component } from 'react'
import { Object3D } from 'react-three'
import { Vector3 } from 'three'
import numeric from 'numeric'
import Cube from './cube'
import Vector from './vector'
import colors from '../../constants/colors'

const axes = [ 'X', 'Y', 'Z' ]

export default class Tensor extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { position, size, quaternion } = this.props
    const vectorProps = this.buildVectors()
    const cubeProps = {
      position,
      size,
      color: colors.tensor,
    }

    return (
      <Object3D quaternion={quaternion}>
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
    const magnitude = size
    let eigenValues

    try {
      eigenValues = numeric.eig(value)
    } catch (error) {
      console.debug('Invalid tensor, cannot find eigenvalues')

      return []
    }

    // Scale the vectors by the largest principle value
    const maxValue = Math.max(...numeric.abs(eigenValues.lambda.x))

    function buildVector(faceIndex, orientationIndex, value, opposite) {
      if (!value) {
        return null
      }

      const direction = [ 0, 0, 0 ]
      const position = [ 0, 0, 0 ]
      const scale = Math.abs(value / maxValue)
      const sign = opposite ? -1 : 1
      let color

      // The direction is the same for in-plane and normal vectors
      direction[orientationIndex] = sign

      // But the position/color is different
      if (faceIndex === orientationIndex) {
        position[orientationIndex] = sign * offset
        color = colors.normalVector
      } else {
        position[faceIndex] = sign * offset * 1.15
        position[orientationIndex] = sign * -(magnitude * scale) / 2
        color = colors.inPlaneVector
      }

      return {
        key: axes[faceIndex] + axes[orientationIndex] + (opposite ? 'i' : ''),
        direction: new Vector3(...direction),
        position: new Vector3(...position),
        invert: value < 0,
        magnitude,
        scale,
        color,
      }
    }

    const vectors = axes.reduce((result, _, faceIndex) => {
      axes.forEach((_, orientationIndex) => {
        // Primary vector
        result.push(buildVector(faceIndex, orientationIndex, value[faceIndex][orientationIndex]))
        // Equilibrium vector on opposite face
        result.push(buildVector(faceIndex, orientationIndex, value[faceIndex][orientationIndex], true))
      })

      return result
    }, [])

    // Remove any nulls (zero vectors)
    return vectors.filter((props) => props)
  }
}
