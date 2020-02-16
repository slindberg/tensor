import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Object3D, Mesh } from 'react-three'
import { Vector3 } from 'three'
import { createPlaneGeometry, createCircleGeometry, createInvisibleMaterial } from '../../utils/three'
import update from 'react-addons-update'
import unitNormals from '../../utils/unit-normals'
import scene from '../../constants/scene'
import geometry from '../../constants/geometry'

const planeSize = scene.cameraRange[1]

const propTypes = {
  cameraPosition: PropTypes.instanceOf(Vector3).isRequired,
}

export default class PickerPlanes extends Component {
  constructor(props, context) {
    super(props, context)

    this.originPosition = new Vector3()
    this.eyePlanePosition = new Vector3()
    this.eyePlaneNormal = new Vector3()
    this.unitNormals = unitNormals()
  }

  render() {
    const { originPosition, eyePlanePosition, eyePlaneNormal, unitNormals } = this
    const { cameraPosition } = this.props

    const planes = [
      {
        name: 'X',
        position: originPosition,
        normal: unitNormals[0],
      },
      {
        name: 'Y',
        position: originPosition,
        normal: unitNormals[1],
      },
      {
        name: 'Z',
        position: originPosition,
        normal: unitNormals[2]
      },
      {
        name: 'E',
        position: eyePlanePosition.copy(cameraPosition).setLength(geometry.eyePickerDistance),
        normal: eyePlaneNormal.copy(cameraPosition).normalize(),
      },
    ]

    // These planes are used to find the intersection with a given plane
    const planeProps = planes.map((plane) => {
      return update(plane, {
        geometry: { '$set': createPlaneGeometry(planeSize, plane.normal) },
        material: { '$set': createInvisibleMaterial() },
      })
    })

    // These objects are used to actually pick a plane, so geometry is important
    const pickerProps = planeProps.map((props) => {
      // For the free-rotation plane use a circle centered in the field of view
      if (props.name === 'E') {
        return update(props, {
          geometry: { '$set': createCircleGeometry(geometry.eyePickerRadius, props.normal) },
        })
      }

      // The normal planes work for picking since they overlap each other
      return props
    })

    return (
      <Object3D>
        <Object3D name="planes">
          {planeProps.map(props => <Mesh key={props.name} {...props} />)}
        </Object3D>
        <Object3D name="pickers">
          {pickerProps.map(props => <Mesh key={props.name} {...props} />)}
        </Object3D>
      </Object3D>
    )
  }
}

PickerPlanes.propTypes = propTypes
