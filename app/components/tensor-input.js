import React, { Component } from 'react'
import ScalarInput from './scalar-input'
import styles from '../styles/input'

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
    const { value, disabled } = this.props
    const order = orderFor(this.props.value)

    if (order > 0) {
      return (
        <div className={order > 1 ? styles.tensor : styles.vector}>
          {value.map((value, index) =>
            <TensorInput key={index} value={value} disabled={disabled} onChange={this.updateVector.bind(this, index)} />
          )}
        </div>
      )
    } else {
      return (
        <ScalarInput value={value} disabled={disabled} onChange={this.updateScalar.bind(this)} />
      )
    }
  }
}

function orderFor(value) {
  return Array.isArray(value) ? orderFor(value[0]) + 1 : 0
}
