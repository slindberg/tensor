import React, { Component } from 'react'
import TensorInput from './input/tensor'
import ThreeSpace from './three-space'
import update from 'react-addons-update'
import { loadState, storeState } from '../utils/storage'
import rotateTensor from '../utils/rotate-tensor'
import eigenValues from '../utils/eigen-values'
import styles from '../styles/layout'
import math from '../constants/math'

class App extends Component {
  constructor(props, context) {
    super(props, context)

    const loadedState = loadState()

    this.state = update({
      isInputSymmetric: true,
      inputTensor: math.zeroMatrix,
      rotationMatrix: math.identityMatrix,
    }, {
      '$merge': loadedState || {},
    })
  }

  // Shorthand method for changing a single key in the state hash
  setStateProp(key, value) {
    const newState = update(this.state, {
      [key]: {
        '$set': value,
      },
    })

    this.setState(newState)
  }

  setState(state) {
    // Save the tensor state to persist across reloads
    storeState(state)

    super.setState(state)
  }

  render() {
    const { inputTensor, rotationMatrix, isInputSymmetric } = this.state
    const transformedTensor = rotateTensor(inputTensor, rotationMatrix)
    const principleValues = eigenValues(inputTensor)
    const spaceProps = {
      tensor: transformedTensor,
      principleValues,
      rotationMatrix,
    }

    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <h3>
            Input
            <button onClick={() => this.setStateProp('inputTensor', math.zeroMatrix)}>clear</button>
          </h3>
          <label>
            <input type="checkbox" checked={isInputSymmetric} onChange={event => this.setStateProp('isInputSymmetric', event.target.checked)} />
            Symmetric
          </label>
          <TensorInput value={inputTensor} symmetric={isInputSymmetric} onChange={value => this.setStateProp('inputTensor', value)} />
          <h3>Priciple Values</h3>
          <TensorInput value={principleValues} disabled={true} />
          <h3>
            Transformed
            <button onClick={() => this.setStateProp('rotationMatrix', math.identityMatrix)}>reset</button>
          </h3>
          <TensorInput value={transformedTensor} disabled={true} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace onRotate={value => this.setStateProp('rotationMatrix', value)} {...spaceProps} />
        </div>
      </div>
    )
  }
}

export default App
