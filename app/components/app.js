import React, { Component } from 'react'
import TensorInput from './input/tensor'
import ThreeSpace from './three-space'
import update from 'react-addons-update'
import buildQuaternion from '../utils/build-quaternion'
import rotateAxes from '../utils/rotate-axes'
import transformTensor from '../utils/transform-tensor'
import eigenValues from '../utils/eigen-values'
import styles from '../styles/layout'
import math from '../constants/math'

export class App extends Component {
  constructor(props, context) {
    super(props, context)

    const loadedState = this.loadState()

    this.state = update({
      isInputSymmetric: true,
      inputTensor: math.zeroMatrix,
      rotations: [],
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
    // Whenever the state changes, update the stored version as well
    this.storeState(state)

    super.setState(state)
  }

  storeState(state) {
    // Save the tensor state to persist across reloads
    localStorage.tensor = JSON.stringify(state)
  }

  loadState() {
    const serializedState = localStorage.tensor
    let state

    if (serializedState) {
      try {
        state = JSON.parse(serializedState)
      } catch(error) {
        console.debug(`Failed to deserialized state: ${serializedState}`)
      }
    }

    return state
  }

  render() {
    const { inputTensor, rotations, isInputSymmetric } = this.state
    const quaternion = buildQuaternion(rotations)
    const rotatedAxes = rotateAxes(math.identityMatrix, quaternion)
    const transformedTensor = transformTensor(inputTensor, rotatedAxes)
    const principleValues = eigenValues(inputTensor)
    const spaceProps = {
      tensor: transformedTensor,
      principleValues,
      rotations,
    }

    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <h3>
            Input
            <button onClick={() => this.setStateProp('inputTensor', math.zeroMatrix)}>clear</button>
          </h3>
          <label>
            <input type="checkbox" checked={isInputSymmetric} onChange={(event) => this.setStateProp('isInputSymmetric', event.target.checked)} />
            Symmetric
          </label>
          <TensorInput value={inputTensor} symmetric={isInputSymmetric} onChange={(value) => this.setStateProp('inputTensor', value)} />
          <h3>Priciple Values</h3>
          <TensorInput value={principleValues} disabled={true} />
          <h3>
            Transformed
            <button onClick={() => this.setStateProp('rotations', [])}>reset</button>
          </h3>
          <TensorInput value={transformedTensor} disabled={true} />
        </div>
        <div className={styles.visualization}>
          <ThreeSpace onChange={(value) => this.setStateProp('rotations', value)} {...spaceProps} />
        </div>
      </div>
    )
  }
}
