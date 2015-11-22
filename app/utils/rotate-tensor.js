import { dot, transpose } from 'numeric'

// Rotate a tensor from its current coordinate system to another
// See: http://www.continuummechanics.org/cm/stressxforms.html
export default function transformTensor(tensor, rotation) {
  return dot(dot(transpose(rotation), tensor), rotation)
}
