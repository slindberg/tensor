import React, { Component } from 'react'
import { Object3D } from 'react-three'
import THREE from 'three'

class ArrowHelper extends Object3D {
  createTHREEObject() {
    const lineWidth = 5
    const headLength = 40
    const headWidth = 30
    const { position, direction, magnitude, color } = this._currentElement.props
    const arrowHelper = new THREE.ArrowHelper(direction, position, magnitude, color, headLength, headWidth)

    arrowHelper.line.material.linewidth = lineWidth
    arrowHelper.cone.material = new THREE.MeshPhongMaterial({ color, specular: 0x555555, shininess: 10 })

    return arrowHelper
  }

  // The `quaternion` prop gets stomped on by this method with an empty default
  applyTHREEObject3DPropsToObject() {}
}

export default class Vector extends Component {
  render() {
    return <ArrowHelper {...this.props} />
  }
}
