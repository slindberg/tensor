import React, { Component } from 'react'
import styles from '../../styles/input'

export default class ScalarInput extends Component {
  updateValue(valueStr) {
    let value = +valueStr

    // This means the user is entering a negative
    if (/0?-$/.test(valueStr)) {
      value = -0
    } else if (isNaN(value)) {
      value = 0
    }

    this.props.onChange(value)
  }

  render() {
    let { value, disabled } = this.props

    // Preserve the negative sign
    if (1 / value === -Infinity) {
      value = '-0'
    }

    return (
      <div className={styles.scalar}>
        <input type="text" value={value} disabled={disabled}
          onChange={(event) => this.updateValue(event.target.value)} />
      </div>
    )
  }
}
