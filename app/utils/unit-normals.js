import { Vector3 } from 'three'
import { identityMatrix } from '../constants/math'

export default function unitNormals() {
  return identityMatrix.map(vector => new Vector3(...vector))
}

export function unitNormalMap() {
  const normals = unitNormals()

  return [ 'X', 'Y', 'Z' ].reduce((result, name, index) => {
    result[name] = normals[index]
    return result;
  }, {})
}
