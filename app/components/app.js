import React, { Component } from 'react'
import TensorInput from './input/tensor'
import ThreeSpace from './three-space'
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
      transformedAxes: math.identityMatrix,
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

  updateAxes(value) {
    this.state.transformedAxes = value
    this.setState(this.state)
  }

  resetTensor() {
    this.state.inputTensor = math.zeroMatrix
    this.setState(this.state)
  }

  render() {
    const { inputTensor, transformedAxes, isInputSymmetric } = this.state
    const transformedTensor = transformTensor(inputTensor, transformedAxes)
    const principleValues = eigenValues(inputTensor)

    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <h3>Input</h3>
          <label>
            <input type="checkbox" checked={isInputSymmetric} onChange={(event) => this.updateInputSymmetry(event.target.checked)} />
            Symmetric
          </label>
          <button onClick={this.resetTensor.bind(this)}>clear</button>
          <TensorInput value={inputTensor} symmetric={isInputSymmetric} onChange={this.updateTensor.bind(this)} />
          <h3>Priciple Values</h3>
          <TensorInput value={principleValues} disabled={true} />
          <h3>Transformed</h3>
          <TensorInput value={transformedTensor} disabled={true} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace tensor={transformedTensor} principleValues={principleValues} onChange={this.updateAxes.bind(this)}/>
        </div>
      </div>
    )
  }
}
