import { Vector3 } from 'three'

export default function componentAngles(point) {
  return new Vector3(
    Math.atan2(point.z, point.y),
    Math.atan2(point.x, point.z),
    Math.atan2(point.y, point.x),
  )
}
