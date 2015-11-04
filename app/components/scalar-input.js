import React, { Component } from 'react'

export default class ScalarInput extends Component {
  updateValue(event) {
    this.props.onChange(event.target.value)
  }

  render() {
    return (
      <div className="scalar-input">
        <input type="text" value={this.props.value} onChange={this.updateValue.bind(this)} />
      </div>
    )
  }
}
