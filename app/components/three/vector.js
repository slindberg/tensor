import React, { Component, PropTypes } from 'react'
import { Object3D } from 'react-three'
import THREE, { Vector3 } from 'three'

const propTypes = {
  position: PropTypes.instanceOf(Vector3).isRequired,
  direction: PropTypes.instanceOf(Vector3).isRequired,
  invert: PropTypes.bool,
  magnitude: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.number.isRequired,
}

const defaultProps = {
  invert: false,
}

class ArrowHelper extends Object3D {
  createTHREEObject() {
    const { position, direction, magnitude, color } = this._currentElement.props
    const headLength = magnitude * 0.2
    const headWidth = magnitude * 0.15

    return new THREE.ArrowHelper(direction, position, magnitude, color, headLength, headWidth)
  }

  // The `quaternion` prop gets stomped on by this method with an empty default
  applyTHREEObject3DProps(oldProps, props) {
    const lineWidth = 10
    const arrowHelper = this._THREEObject3D
    const { magnitude, scale, invert, color } = props
    const { line, cone } = arrowHelper
    let { position, direction } = props

    if (invert) {
      position = position.clone().addScaledVector(direction, scale * magnitude)
      direction = direction.clone().negate()
    }

    arrowHelper.position.copy(position)
    arrowHelper.setDirection(direction)
    arrowHelper.scale.set(scale, scale, scale)

    line.material = new THREE.LineBasicMaterial({ color, linewidth: lineWidth * scale })
    cone.material = new THREE.MeshPhongMaterial({ color, specular: 0x555555, shininess: 10 })
  }
}

export default class Vector extends Component {
  render() {
    return <ArrowHelper {...this.props} />
  }
}

Vector.propTypes = propTypes
Vector.defaultProps = defaultProps
