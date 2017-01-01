import { eig, det } from 'numeric'
import { identityMatrix, zeroThreshold } from '../constants/math'

function normalizedEigen(matrix) {
  try {
    const result = eig(matrix)

    // Assume all results are real (y is the complex component)
    return {
      values: result.lambda.x,
      vectors: result.E.x,
    }
  } catch (error) {
    return {
      values: [ 0, 0, 0 ],
      vectors: identityMatrix,
    }
  }
}

// Returns the eigenvalues of the given matrix (if any)
export function eigenValues(matrix) {
  return normalizedEigen(matrix).values
}

// Returns the eigenvectors of the given matrix or the unit normals
export function eigenVectors(matrix) {
  let vectors = normalizedEigen(matrix).vectors
  const hasZeroVector = vectors.some(vector => vector.every(scalar => scalar === 0))

  // Eigenvectors of degenerate matricies aren't valid rotations
  if (hasZeroVector) {
    return identityMatrix
  }

  // Approximate super tiny values to zero
  vectors = vectors.map(vector => vector.map((scalar) => {
    return scalar < zeroThreshold && scalar > -zeroThreshold ? 0 : scalar
  }))

  // The coordinate system defined by the vectors is flipped if the determinant
  // is less than zero
  if (det(vectors) < 0) {
    vectors = vectors.map(vector => vector.map(scalar => -scalar))
  }

  return vectors
}
