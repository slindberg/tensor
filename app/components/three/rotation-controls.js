import React, { Component } from 'react'
import { Vector2, Vector3, Quaternion } from 'three'
import scene from '../../constants/scene'

export default class RotationControls extends Component {
  constructor(props, context) {
    super(props, context)

    this.isRotating = false

    this.rotateSpeed = 0.01

    this.positions = {
      current: new Vector2(),
      previous: new Vector2(),
    }

    this.directions = {
      eye: new Vector3(...scene.cameraPosition).normalize(),
      up: new Vector3(...scene.upDirection),
      move: new Vector2(),
    }

    this.axes = {
      xRotation: new Vector3(),
      yRotation: new Vector3(),
      combinedRotation: new Vector3(),
    }

    this.rotationQuaternion = new Quaternion()
  }

  handleMouseDown(event) {
    const { pageX, pageY } = event
    const { current, previous } = this.positions

    this.isRotating = true

    current.set(pageX, pageY)
    previous.copy(current)
  }

  handleMouseUp() {
    this.isRotating = false
  }

  handleMouseOut() {
    this.isRotating = false
  }

  handleMouseMove(event) {
    if (this.isRotating) {
      const { pageX, pageY } = event
      const { current, previous } = this.positions

      previous.copy(current)
      current.set(pageX, pageY)

      this.calculateRotation()
    }
  }

  calculateRotation() {
    const { quaternion } = this.props
    const { positions, directions, axes } = this

    directions.move.subVectors(positions.current, positions.previous)
    const moveDistance = directions.move.length()

    if (moveDistance) {
      const angle = moveDistance * this.rotateSpeed

      axes.xRotation.crossVectors(directions.eye, directions.up)
      axes.yRotation.copy(directions.up)

      axes.xRotation.applyQuaternion(quaternion.conjugate())
      axes.yRotation.applyQuaternion(quaternion.conjugate())

      axes.xRotation.multiplyScalar(-directions.move.y)
      axes.yRotation.multiplyScalar(directions.move.x)

      axes.combinedRotation.addVectors(axes.xRotation, axes.yRotation).normalize()

      this.rotationQuaternion.setFromAxisAngle(axes.combinedRotation, angle)

      quaternion.multiply(this.rotationQuaternion)

      this.props.onChange(quaternion)
    }
  }

  render() {
    return (
      <div onMouseDown={this.handleMouseDown.bind(this)}
        onMouseUp={this.handleMouseUp.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}>
        {this.props.children}
      </div>
    )
  }
}