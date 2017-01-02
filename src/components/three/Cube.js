import React, { Component, PropTypes } from 'react'
import { Mesh } from 'react-three'
import THREE, { Vector3 } from 'three'

const propTypes = {
  position: PropTypes.instanceOf(Vector3).isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.number.isRequired,
}

class Cube extends Component {
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

export default Cube
