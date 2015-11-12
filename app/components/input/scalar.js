import React, { Component } from 'react'
import styles from '../../styles/input'

export default class ScalarInput extends Component {
  updateValue(event) {
    const valueStr = event.target.value
    let value = +valueStr

    if (isNaN(value)) {
      value = 0
    }

    this.props.onChange(value)
  }

  render() {
    return (
      <div className={styles.scalar}>
        <input type="text" value={this.props.value} disabled={this.props.disabled} onChange={this.updateValue.bind(this)} />
      </div>
    )
  }
}
