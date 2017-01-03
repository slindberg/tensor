import React, { Component, PropTypes } from 'react'
import { Object3D, Mesh } from 'react-three'
import { Vector3 } from 'three'
import { createPlaneGeometry, createCircleGeometry, createMaterial, createInvisibleMaterial } from '../../utils/three'
import { unitNormalMap } from '../../utils/unit-normals'
import scene from '../../constants/scene'
import geometry from '../../constants/geometry'
import colors from '../../constants/colors'

const planeSize = scene.cameraRange[1]

const pointerEvents = [
  'onMouseDown',
  'onMouseUp',
  'onMouseMove',
  'onMouseOut',
  // 'onMouseEnter',
  // 'onMouseLeave',
]


const propTypes = {
  cameraPosition: PropTypes.instanceOf(Vector3).isRequired,
}

pointerEvents.forEach(eventName => propTypes[`${eventName}3D`] = PropTypes.func)

class PickerPlanes extends Component {
  constructor(props, context) {
    super(props, context)

    this.originPosition = new Vector3()
    this.eyePlanePosition = new Vector3()
    this.eyePlaneNormal = new Vector3()
    this.unitNormals = unitNormalMap()
  }

  render() {
    const { originPosition, eyePlanePosition, eyePlaneNormal, unitNormals } = this
    const { cameraPosition, ...props } = this.props

    const planes = [
      {
        name: 'X',
        position: originPosition,
        normal: unitNormals.X,
      },
      {
        name: 'Y',
        position: originPosition,
        normal: unitNormals.Y,
      },
      {
        name: 'Z',
        position: originPosition,
        normal: unitNormals.Z,
      },
      {
        name: 'E',
        position: eyePlanePosition.copy(cameraPosition).setLength(geometry.eyePickerDistance),
        normal: eyePlaneNormal.copy(cameraPosition).normalize(),
      },
    ]

    // These planes are used to find the intersection with a given plane
    const pickerProps = planes.map((plane) => {
      let pickerGeometry

      // For the free-rotation plane use a circle centered in the field of view
      if (plane.name === 'E') {
        pickerGeometry = createCircleGeometry(geometry.eyePickerRadius, plane.normal)
      } else {
        pickerGeometry = createPlaneGeometry(planeSize, plane.normal)
      }

      // Add pointer event handlers if specified in props
      const events = pointerEvents.reduce((result, eventName) => {
        const eventName3D = `${eventName}3D`

        if (props[eventName3D]) {
          result[eventName3D] = props[eventName3D]
        }

        return result
      }, {})

      return {
        ...plane,
        ...events,
        geometry: pickerGeometry,
        material: createInvisibleMaterial(),
      }
    })

    return (
      <Object3D>
        {pickerProps.map(props => <Mesh key={props.name} {...props} />)}
        {this.buildActivePlane()}
      </Object3D>
    )
  }

  buildActivePlane() {
    const { unitNormals } = this
    const { activePlane } = this.props

    // Only display the active plane for axis normals
    if (~'XYZ'.indexOf(activePlane)) {
      const activePlaneProps = {
        position: new Vector3(0, 0, 0),
        geometry: createCircleGeometry(geometry.visualPlaneRadius, unitNormals[activePlane]),
        material: createMaterial(colors.axis[activePlane], scene.planeOpacity),
      }

      return <Mesh {...activePlaneProps} />
    }
  }
}

PickerPlanes.propTypes = propTypes

export { pointerEvents }
export default PickerPlanes
