import React, { Component, PropTypes } from 'react'
import { Renderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, AxisHelper } from 'react-three'
import { Vector3, Quaternion } from 'three'
import { Dispatcher } from 'flux'
import Measure from 'react-measure'
import PickerPlanesContainer from '../containers/PickerPlanesContainer'
import { pointerEvents } from './three/PickerPlanes'
import Tensor from './three/Tensor'
import update from 'react-addons-update'
import { matrixType, vectorType } from '../utils/prop-types'
import colors from '../constants/colors'
import scene from '../constants/scene'
import geometry from '../constants/geometry'
import '../styles/visualization.css'

const propTypes = {
  tensor: matrixType,
  principleValues: vectorType,
  quaternion: PropTypes.instanceOf(Quaternion),
}

class ThreeSpace extends Component {
  constructor() {
    super()

    this.state = {
      dimensions: {
        width: 0,
        height: 0,
      },
      cameraPosition: new Vector3(...scene.cameraPosition),
      isRotating: false,
      dispatcher: new Dispatcher(),
    }
  }

  updateIsRotating(isRotating) {
    this.setState(update(this.state, {
      isRotating: { '$set': isRotating },
    }))
  }

  render() {
    const { tensor, principleValues, rotationMatrix } = this.props
    const { dimensions, cameraPosition, isRotating } = this.state
    const { width, height } = dimensions
    const size = Math.min(width, height)

    const rendererProps = {
      width: size,
      height: size,
      transparent: true,
    }
    const sceneProps = {
      width: size,
      height: size,
      camera: 'maincamera',
      pointerEvents,
    }
    const cameraProps = {
      name: 'maincamera',
      fov: scene.fieldOfView,
      aspect: scene.aspectRatio,
      near: scene.cameraRange[0],
      far: scene.cameraRange[1],
      position: cameraPosition,
      lookat: new Vector3(...scene.lookAtPosition),
    }
    const lightProps = {
      intensity: scene.lightIntensity,
      position: new Vector3(...scene.lightPosition),
    }
    const tensorProps = {
      value: tensor,
      principleValues,
      position: new Vector3(...geometry.tensorPosition),
      size: geometry.tensorSize,
      rotationMatrix,
    }

    return (
      <Measure
        whitelist={[ 'width', 'height' ]}
        onMeasure={(dimensions) => { this.setState({ dimensions })}}>
        <div className={isRotating ? 'rotating' : 'static' }>
          <Renderer {...rendererProps}>
            <Scene {...sceneProps}>
              <PerspectiveCamera {...cameraProps} />
              <AmbientLight color={colors.ambientLight} />
              <DirectionalLight color={colors.directionalLight} {...lightProps} />
              <AxisHelper size={geometry.axisSize} />
              <Tensor {...tensorProps} />
              <PickerPlanesContainer cameraPosition={cameraPosition} />
            </Scene>
          </Renderer>
        </div>
      </Measure>
    )
  }
}

ThreeSpace.propTypes = propTypes

export default ThreeSpace
