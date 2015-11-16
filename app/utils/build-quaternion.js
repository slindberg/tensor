import { Vector3, Quaternion } from 'three'

// Reused THREE objects
const intermediateQuaternion = new Quaternion()
const vector = new Vector3()

// Creates a quaternion from a set of axis/angle rotations
export default function buildQuaternion(rotations) {
  return rotations.reduce((quaternion, { axis, angle }) => {
    if (angle) {
      intermediateQuaternion.setFromAxisAngle(vector.set(...axis), angle)

      quaternion.multiply(intermediateQuaternion)
    }

    return quaternion
  }, new Quaternion()).toArray()
}
