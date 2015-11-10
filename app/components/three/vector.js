import React, { Component } from 'react'
import { Object3D } from 'react-three'
import THREE from 'three'

class ArrowHelper extends Object3D {
  createTHREEObject() {
    const { position, direction, magnitude, color } = this._currentElement.props
    const headLength = magnitude * 0.2
    const headWidth = magnitude * 0.15

    return new THREE.ArrowHelper(direction, position, magnitude, color, headLength, headWidth)
  }

  // The `quaternion` prop gets stomped on by this method with an empty default
  applyTHREEObject3DProps(oldProps, props) {
    const lineWidth = 5
    const arrowHelper = this._THREEObject3D
    const { scale, color, position } = props
    const { line, cone } = arrowHelper

    arrowHelper.position.copy(position)

    if (scale > 0.001) {
      line.material = new THREE.LineBasicMaterial({ color, linewidth: lineWidth * scale })
      cone.material = new THREE.MeshPhongMaterial({ color, specular: 0x555555, shininess: 10 })
      arrowHelper.scale.set(scale, scale, scale)
    } else {
      line.material = new THREE.LineBasicMaterial({ transparent: true, opacity: 0 })
      cone.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    }
  }
}

export default class Vector extends Component {
  render() {
    return <ArrowHelper {...this.props} />
  }
}
