import React, { Component } from 'react'
import TensorInput from './tensor-input'
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
      inputTensor: zeroMatrix,
      transformedTensor: zeroMatrix,
    }
  }

  updateTensor(value) {
    this.state.inputTensor = value
    this.setState(this.state)
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <h3>Input</h3>
          <TensorInput value={this.state.inputTensor} onChange={this.updateTensor.bind(this)} />
          <h3>Transformed</h3>
          <TensorInput value={this.state.transformedTensor} disabled={true} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace tensor={this.state.inputTensor} />
        </div>
      </div>
    )
  }
}
