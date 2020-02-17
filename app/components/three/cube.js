import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mesh } from 'react-three'
import * as THREE from 'three'

const propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.number.isRequired,
}

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

Cube.propTypes = propTypes
