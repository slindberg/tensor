import React, { Component } from 'react'
import NumberInput from 'react-number-input'
import styles from '../../styles/input'

export default class ScalarInput extends Component {
  updateValue(valueStr) {
    let value = +valueStr

    this.props.onChange(value)
  }

  selectText(input) {
    input.setSelectionRange(0, input.value.length)
  }

  render() {
    let { value, disabled } = this.props

    return (
      <div className={styles.scalar}>
        <NumberInput type="text" value={value} disabled={disabled}
          onChange={(event) => this.updateValue(event.target.value)}
          onFocus={(event) => this.selectText(event.target)} />
      </div>
    )
  }
}
