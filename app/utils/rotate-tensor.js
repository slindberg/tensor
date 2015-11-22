import { dot } from 'numeric'
import { identityMatrix } from '../constants/math'

// Convert a tensor in one coordinate system to another
export default function transformTensor(tensor, rotation) {
  // Create rotated unit axes
  const normals = identityMatrix.map((axis) => {
    return dot(rotation, axis)
  })

  // The elements of the transformed tensor are the product of tensor with the
  // corresponding plane normal (row), then dotted with the corresponding unit
  // normal (column)
  return tensor.map((row, i) => {
    return row.map((value, j) => {
      // Note: 'dotting' a matrix with a vector is just a normal multiply (that
      // results in a vector)
      return dot(dot(tensor, normals[j]), normals[i])
    })
  })
}
