export function matrixType(props, propName) {
  if (!isMatrix3(props[propName])) {
    return new Error(`${propName} is not a 3x3 structured matrix`)
  }
}

export function vectorType(props, propName) {
  if (!isVector3(props[propName])) {
    return new Error(`${propName} is not a 3 element array`)
  }
}

function isArray3(value) {
  return Array.isArray(value) && value.length === 3
}

function isVector3(value) {
  return isArray3(value)
    && typeof value[0] === 'number'
    && typeof value[1] === 'number'
    && typeof value[2] === 'number'
}

function isMatrix3(value) {
  return isArray3(value)
    && isVector3(value[0])
    && isVector3(value[1])
    && isVector3(value[2])
}
