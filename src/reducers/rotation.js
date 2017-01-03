import { Vector3, Matrix4 } from 'three'
import componentAngles from '../utils/component-angles'
import { unitNormalMap } from '../utils/unit-normals'
import scene from '../constants/scene'

const defaultState = {
  cameraPosition: new Vector3(...scene.cameraPosition),
  isRotating: false,
  activePlane: null,
  referencePosition: null,
  referenceRotation: null,
  rotationMatrix: new Matrix4(),
}

// Reusable THREE objects
const rotationMatrix = new Matrix4()
const newRotationMatrix = new Matrix4()
const eyeAxis = new Vector3()
const unitNormals = unitNormalMap()
const offsetAngles = new Vector3()
const moveDirection = new Vector3()

function rotationReducer(state = defaultState, action) {
  const { intersection } = action
  const {
    cameraPosition,
    activePlane,
    referencePosition,
    referenceRotation,
    rotationMatrix,
  } = state

  switch (action.type) {
    case 'BEGIN_ROTATE':
      return {
        ...state,
        isRotating: true,
        activePlane: intersection.object.name,
        referencePosition: intersection.point.clone(),
        referenceRotation: rotationMatrix.clone(),
      }
    case 'ROTATE':
      const newState = {}

      if (state.isRotating) {
        const newRotation = calculateRotation(referenceRotation, referencePosition, intersection.point, activePlane, cameraPosition)

        if (newRotation) {
          newState.rotationMatrix = newRotation
        }

        // For free-rotation, treat individual movements as separate to allow
        // rotation about the camera axis
        if (activePlane === 'E') {
          newState.referencePosition = intersection.point.clone()
          newState.referenceRotation = rotationMatrix.clone()
        }
      } else {
        newState.activePlane = intersection.object.name
      }

      return {
        ...state,
        ...newState,
      }
    case 'END_ROTATE':
      return {
        ...state,
        isRotating: false,
        activePlane: null,
        referencePosition: null,
        referenceRotation: null,
      }
    default:
      return state
  }
}

function calculateRotation(referenceRotation, referencePosition, offsetPosition, activePlane, cameraPosition) {
  let axis, angle

  offsetAngles.subVectors(componentAngles(offsetPosition), componentAngles(referencePosition))

  // The free-rotation axis is dependent on the movement direction
  if (activePlane === 'E') {
    moveDirection.subVectors(referencePosition, offsetPosition)
    axis = eyeAxis.crossVectors(moveDirection, cameraPosition).normalize()
    angle = offsetAngles.length()
  } else {
    axis = unitNormals[activePlane]
    angle = offsetAngles[activePlane.toLowerCase()]
  }

  // Avoid infinitesmal rotations
  if (Math.abs(angle) > scene.rotationThreshold) {
    // Create a new matrix from the new rotation (the negative angle has the
    // effect of inverting the new rotation)
    newRotationMatrix.makeRotationAxis(axis, -angle)

    // Apply the new rotation in the current rotation's frame
    rotationMatrix.getInverse(referenceRotation).multiply(newRotationMatrix)

    // Return to orignial rotation's frame
    rotationMatrix.getInverse(rotationMatrix)

    // // Extract just the rotation component (3x3)
    // normalMatrix.getNormalMatrix(rotationMatrix)
    //
    // // Create a structured matrix from the flat array that THREE uses
    // const structuredMatrix = restructureMatrix(normalMatrix.toArray())
    //
    // return structuredMatrix

    return rotationMatrix.clone()
  }
}

export default rotationReducer
