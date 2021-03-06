import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NumberInput from 'react-number-input'
import styles from '../../styles/input'
import math from '../../constants/math'

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number.isRequired,
}

export default class ScalarInput extends Component {
  updateValue(valueStr) {
    let value = +valueStr

    this.props.onChange(value)
  }

  selectText(input) {
    input.setSelectionRange(0, input.value.length)
  }

  render() {
    const { value, disabled } = this.props
    const inputProps = {
      type: 'text',
      format: `0,0[.][${'0'.repeat(math.decimalPrecision)}]`,
      value,
      disabled,
    }

    return (
      <div className={styles.scalar}>
        <NumberInput {...inputProps}
          onChange={value => this.updateValue(value)}
          onFocus={event => this.selectText(event.target)} />
      </div>
    )
  }
}

ScalarInput.propTypes = propTypes
