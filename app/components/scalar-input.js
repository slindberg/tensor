import React, { Component } from 'react'
import styles from '../styles/input'

export default class ScalarInput extends Component {
  updateValue(event) {
    this.props.onChange(event.target.value)
  }

  render() {
    return (
      <div className={styles.scalar}>
        <input type="text" value={this.props.value} onChange={this.updateValue.bind(this)} />
      </div>
    )
  }
}
