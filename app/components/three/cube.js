import React, { Component } from 'react'
import { Mesh } from 'react-three'
import THREE from 'three'

export default class Cube extends Component {
  render() {
    const { color, size, position } = this.props
    const meshProps = {
      geometry: new THREE.BoxGeometry(size, size, size),
      material: new THREE.MeshPhongMaterial({ color }),
      position,
    }

    return <Mesh {...meshProps} />
  }
}
