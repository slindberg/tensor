import { Vector3, Quaternion } from 'three'

// Reused THREE objects
const quaternion = new Quaternion()
const vector = new Vector3()

export default function rotateAxes(axes, rotation) {
  quaternion.set(...rotation)

  return axes.map((axis) => {
    return vector.set(...axis).applyQuaternion(quaternion).toArray()
  })
}
