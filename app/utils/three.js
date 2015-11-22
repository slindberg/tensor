import THREE from 'three'

export function createPlaneGeometry(size) {
  return new THREE.PlaneGeometry(size, size)
}

export function createCircleGeometry(radius) {
  return new THREE.CircleGeometry(radius, 64)
}

export function createMaterial(color, opacity) {
  const options = {
    color: color,
    side: THREE.DoubleSide,
  }

  if (opacity) {
    options.opacity = opacity
    options.transparent = true
  }

  return new THREE.MeshBasicMaterial(options)
}

export function createInvisibleMaterial() {
  return new THREE.MeshBasicMaterial({
    visible: false,
    side: THREE.FrontSide,
  })
}
