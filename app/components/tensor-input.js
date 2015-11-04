import React, { Component } from 'react'
import ScalarInput from './scalar-input'

export default class TensorInput extends Component {
  updateVector(changedIndex, newValue) {
    this.props.onChange(this.props.value.map((value, index) => {
      return index === changedIndex ? newValue : value
    }))
  }

  updateScalar(value) {
    this.props.onChange(value)
  }

  render() {
    if (Array.isArray(this.props.value)) {
      return (
        <div className="tensor-input">
          {this.props.value.map((value, index) =>
            <TensorInput key={index} value={value} onChange={this.updateVector.bind(this, index)} />
          )}
        </div>
      )
    } else {
      return (
        <ScalarInput value={this.props.value} onChange={this.updateScalar.bind(this)} />
      )
    }
  }
}
