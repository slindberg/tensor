import numeric from 'numeric'

// Returns the eigenvalues of the given matrix (if any)
export default function(matrix) {
  try {
    return numeric.eig(matrix).lambda.x
  } catch (error) {
    return [ 0, 0, 0 ]
  }
}
