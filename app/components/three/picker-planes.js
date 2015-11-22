import React, { Component, PropTypes } from 'react'
import { Object3D, Mesh } from 'react-three'
import { Vector3 } from 'three'
import { createPlaneGeometry, createCircleGeometry, createInvisibleMaterial } from '../../utils/three'
import scene from '../../constants/scene'
import geometry from '../../constants/geometry'

const planeSize = scene.cameraRange[1]

const propTypes = {
  cameraPosition: PropTypes.instanceOf(Vector3).isRequired,
}

export default class PickerPlanes extends Component {
  render() {
    const { cameraPosition } = this.props
    const planeProps = [
      {
        name: 'X',
        position: new Vector3(0, 0, 0),
        normal: new Vector3(1, 0, 0),
        geometry: createPlaneGeometry(planeSize),
        material: createInvisibleMaterial(),
      },
      {
        name: 'Y',
        position: new Vector3(0, 0, 0),
        normal: new Vector3(0, 1, 0),
        geometry: createPlaneGeometry(planeSize),
        material: createInvisibleMaterial(),
      },
      {
        name: 'Z',
        position: new Vector3(0, 0, 0),
        normal: new Vector3(0, 0, 1),
        geometry: createPlaneGeometry(planeSize),
        material: createInvisibleMaterial(),
      },
      {
        name: 'E',
        position: new Vector3().copy(cameraPosition).setLength(geometry.eyePickerDistance),
        normal: new Vector3().copy(cameraPosition).normalize(),
        geometry: createCircleGeometry(geometry.eyePickerRadius),
        material: createInvisibleMaterial(),
      },
    ]

    planeProps.forEach(({ geometry, normal }) => geometry.lookAt(normal))

    return (
      <Object3D name="pickers">
        {planeProps.map(props => <Mesh key={props.name} {...props} />)}
      </Object3D>
    )
  }
}

PickerPlanes.propTypes = propTypes
