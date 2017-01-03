import React from 'react'
import { connect } from 'react-redux'
import { rotationAction } from '../actions/rotation'
import PickerPlanes, { pointerEvents } from '../components/three/PickerPlanes'

const PickerPlanesContainer = (props) => {
  return <PickerPlanes {...props} />
}

function mapStateToProps(state, ownProps) {
  const { activePlane } = state.rotation

  return {
    activePlane,
    ...ownProps,
  }
}

function mapDispatchToProps(dispatch) {
  const events = pointerEvents.reduce((result, eventName) => {
    result[`${eventName}3D`] = (event, intersection) => {
      dispatch(rotationAction(eventName, intersection))
    }
    return result
  }, {})

  return events
}

export default connect(mapStateToProps, mapDispatchToProps)(PickerPlanesContainer)
