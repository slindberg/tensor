import React, { Component } from 'react'
import TensorInput from './input/tensor'
import ThreeSpace from './three-space'
import buildQuaternion from '../utils/build-quaternion'
import rotateAxes from '../utils/rotate-axes'
import transformTensor from '../utils/transform-tensor'
import eigenValues from '../utils/eigen-values'
import styles from '../styles/layout'
import math from '../constants/math'

export class App extends Component {
  constructor(props, context) {
    super(props, context)

    const serializedTensor = localStorage.inputTensor
    let inputTensor

    if (serializedTensor) {
      try {
        inputTensor = JSON.parse(serializedTensor)
      } catch(error) {
        console.debug('Failed to deserialized tensor: ' + serializedTensor)
      }
    }

    this.state = {
      isInputSymmetric: true,
      inputTensor: inputTensor || math.zeroMatrix,
      rotations: [],
    }
  }

  updateTensor(value) {
    this.state.inputTensor = value
    this.setState(this.state)

    // Save the tensor state to persist across reloads
    localStorage.inputTensor = JSON.stringify(value)
  }

  updateInputSymmetry(value) {
    this.state.isInputSymmetric = value
    this.setState(this.state)
  }

  updateRotations(value) {
    this.state.rotations = value
    this.setState(this.state)
  }

  resetTensor() {
    this.state.inputTensor = math.zeroMatrix
    this.setState(this.state)
  }

  resetRotations() {
    this.state.rotations = []
    this.setState(this.state)
  }

  render() {
    const { inputTensor, rotations, isInputSymmetric } = this.state
    const quaternion = buildQuaternion(rotations)
    const rotatedAxes = rotateAxes(math.identityMatrix, quaternion)
    const transformedTensor = transformTensor(inputTensor, rotatedAxes)
    const principleValues = eigenValues(inputTensor)
    const spaceProps = {
      tensor: transformedTensor,
      principleValues,
      rotations,
    }

    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <h3>
            Input
            <button onClick={this.resetTensor.bind(this)}>clear</button>
          </h3>
          <label>
            <input type="checkbox" checked={isInputSymmetric} onChange={(event) => this.updateInputSymmetry(event.target.checked)} />
            Symmetric
          </label>
          <TensorInput value={inputTensor} symmetric={isInputSymmetric} onChange={this.updateTensor.bind(this)} />
          <h3>Priciple Values</h3>
          <TensorInput value={principleValues} disabled={true} />
          <h3>
            Transformed
            <button onClick={this.resetRotations.bind(this)}>reset</button>
          </h3>
          <TensorInput value={transformedTensor} disabled={true} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace onChange={this.updateRotations.bind(this)} {...spaceProps} />
        </div>
      </div>
    )
  }
}
