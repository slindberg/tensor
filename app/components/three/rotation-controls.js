import React, { Component } from 'react'
import { Vector2, Vector3 } from 'three'
import scene from '../../constants/scene'

const directions = {
  eye: new Vector3(...scene.cameraPosition).normalize(),
  up: new Vector3(...scene.upDirection),
}

const availableRotations = [
  {
    name: 'EX',
    axis: new Vector3().crossVectors(directions.eye, directions.up).normalize().toArray(),
  },
  {
    name: 'Y',
    axis: directions.up.toArray(),
  },
]

export default class RotationControls extends Component {
  constructor(props, context) {
    super(props, context)

    this.isRotating = false

    this.rotateSpeed = 0.01

    this.currentPosition = new Vector2(),
    this.previousPosition = new Vector2(),
    this.moveDirection = new Vector2()
  }

  handleMouseDown(event) {
    const { pageX, pageY } = event
    const { currentPosition, previousPosition } = this

    this.isRotating = true

    currentPosition.set(pageX, pageY)
    previousPosition.copy(currentPosition)
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
      const { currentPosition, previousPosition } = this

      previousPosition.copy(currentPosition)
      currentPosition.set(pageX, pageY)

      this.updateRotations()
    }
  }

  updateRotations() {
    const currentRotations = this.props.rotations
    const { currentPosition, previousPosition, moveDirection, rotateSpeed } = this

    moveDirection.subVectors(currentPosition, previousPosition)

    if (moveDirection.length()) {
      const newRotations = availableRotations.map(({ name, axis }) => {
        var currentRotation = currentRotations.find((rotation) => {
          return axis === rotation.axis
        })

        let angle = currentRotation ? currentRotation.angle : 0

        if (name === 'Y') {
          angle += moveDirection.x * rotateSpeed
        } else if (name === 'EX') {
          angle += -moveDirection.y * rotateSpeed
        }

        return { axis, angle }
      })

      this.props.onChange(newRotations)
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
