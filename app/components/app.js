import React, { Component } from 'react'
import TensorInput from './input/tensor'
import ThreeSpace from './three-space'
import styles from '../styles/layout'

export class App extends Component {
  constructor(props, context) {
    super(props, context)

    const zeroMatrix = [
      [ 0, 0, 0 ],
      [ 0, 0, 0 ],
      [ 0, 0, 0 ],
    ]

    this.state = {
      isInputSymmetric: true,
      inputTensor: zeroMatrix,
      transformedTensor: zeroMatrix,
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

  render() {
    const { inputTensor, transformedTensor, isInputSymmetric } = this.state

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
          <ThreeSpace tensor={inputTensor} />
        </div>
      </div>
    )
  }
}
