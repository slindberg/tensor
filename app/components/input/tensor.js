import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ScalarInput from './scalar'
import styles from '../../styles/input'

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
  ]).isRequired,
  disabled: PropTypes.bool,
  symmetric: PropTypes.bool,
}

const defaultProps = {
  disabled: false,
  symmetric: false,
}

export default class TensorInput extends Component {
  updateVector(changedIndex, newVector) {
    const value = this.props.value
    let newValue

    if (this.props.symmetric) {
      newValue = value.map((vector, tensorIndex) => {
        if (tensorIndex === changedIndex) {
          return newVector
        } else {
          return vector.map((scalar, index) => {
            return index === changedIndex ? newVector[tensorIndex] : vector[index]
          })
        }
      })
    } else {
      newValue = value.map((vector, index) => {
        return index === changedIndex ? newVector : vector
      })
    }

    this.props.onChange(newValue)
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

TensorInput.defaultProps = defaultProps
TensorInput.propTypes = propTypes
