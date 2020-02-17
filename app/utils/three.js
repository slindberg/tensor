import * as THREE from 'three'

function rotateGeometry(geometry, normal) {
  if (normal) {
    geometry.lookAt(normal)
  }

  return geometry
}

export function createPlaneGeometry(size, normal) {
  return rotateGeometry(new THREE.PlaneGeometry(size, size), normal)
}

export function createCircleGeometry(radius, normal) {
  return rotateGeometry(new THREE.CircleGeometry(radius, 64), normal)
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
