import { dot } from 'numeric'

export default function rotateAxes(axes, rotation) {
  return axes.map((axis) => {
    return dot(rotation, axis)
  })
}
