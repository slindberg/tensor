export function rotationAction(pointerEvent, intersection) {
  switch (pointerEvent) {
    case 'onMouseDown':
      return {
        type: 'BEGIN_ROTATE',
        intersection,
      }

    case 'onMouseUp':
    case 'onMouseOut':
      return {
        type: 'END_ROTATE',
        intersection,
      }

    case 'onMouseMove':
      return {
        type: 'ROTATE',
        intersection,
      }

    default:
      throw new Error(`Unknown pointer event: ${pointerEvent}`)
  }
}
