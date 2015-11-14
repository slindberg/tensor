import React, { Component } from 'react'
import TensorInput from './input/tensor'
import ThreeSpace from './three-space'
import transformTensor from '../utils/transform-tensor'
import styles from '../styles/layout'
import math from '../constants/math'

export class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      isInputSymmetric: true,
      inputTensor: math.zeroMatrix,
      transformedAxes: math.identityMatrix,
    }
  }

  updateTensor(value) {
    this.state.inputTensor = value
    this.setState(this.state)
  }

  updateInputSymmetry(value) {
    this.state.isInputSymmetric = value
    this.setState(this.state)
  }

  updateAxes(value) {
    this.state.transformedAxes = value
    this.setState(this.state)
  }

  render() {
    const { inputTensor, transformedAxes, isInputSymmetric } = this.state
    const transformedTensor = transformTensor(inputTensor, transformedAxes)

    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <h3>Input</h3>
          <label>
            <input type="checkbox" checked={isInputSymmetric} onChange={(event) => this.updateInputSymmetry(event.target.checked)} />
            Symmetric
          </label>
          <TensorInput value={inputTensor} symmetric={isInputSymmetric} onChange={this.updateTensor.bind(this)} />
          <h3>Transformed</h3>
          <TensorInput value={transformedTensor} disabled={true} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace tensor={transformedTensor} onChange={this.updateAxes.bind(this)}/>
        </div>
      </div>
    )
  }
}
