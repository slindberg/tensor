import React, { Component } from 'react'
import TensorInput from './tensor-input'
import ThreeSpace from './three-space'
import styles from '../styles/layout'

export class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      tensor: [
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0 ],
      ],
    }
  }

  updateTensor(value) {
    this.state.tensor = value
    this.setState(this.state)
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <TensorInput value={this.state.tensor} onChange={this.updateTensor.bind(this)} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace height="500" width="500" />
        </div>
      </div>
    )
  }
}
