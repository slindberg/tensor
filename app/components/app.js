import React, { Component } from 'react'
import TensorInput from './tensor-input'

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
      <div>
        <TensorInput value={this.state.tensor} onChange={this.updateTensor.bind(this)} />
        <br />
        <pre>{JSON.stringify(this.state.tensor, null, 2)}</pre>
      </div>
    )
  }
}
