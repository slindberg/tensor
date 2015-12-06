import ReactDOM from 'react-dom'
import { Scene } from 'react-three'
import eventDispatcher from '../../dispatchers/event'

const pointerEvents = [
  'mouseDown',
  'mouseUp',
  'mouseMove',
  'moustIn',
  'mouseOut',
]

export default class PointerEventScene extends Scene {
  constructor(props, context) {
    super(props, context)

    this.eventListeners = []
  }

  getCanvas() {
    return this.props.canvas || ReactDOM.findDOMNode(this)
  }

  componentDidMount() {
    super.componentDidMount()

    const canvas = this.getCanvas()

    pointerEvents.forEach((eventName) => {
      const listener = (event) => {
        this.handlePointerEvent(eventName, event)
      }

      canvas.addEventListener(eventName.toLowerCase(), listener)

      this.eventListeners.push([ eventName, listener ])
    })
  }

  componentWillUnmount() {
    super.componentWillUnmount()

    const canvas = this.getCanvas()

    this.eventListeners.forEach(([ eventName, listener ]) => {
      canvas.removeEventListener(eventName.toLowerCase(), listener)
    })
  }

  handlePointerEvent(name, event) {
    const { target } = event
    const coordinates = this.getPointerCoordinates(event)

    eventDispatcher.dispatch({ name, target, coordinates })
  }

  getPointerCoordinates(event) {
    const canvas = this.getCanvas()
    const { left, top } = canvas.getBoundingClientRect()
    const { height, width } = this.props
    const { clientX, clientY } = event.touches ? event.touches[0] : event
    const x = ((clientX - left) / width) * 2 - 1
    const y = -((clientY - top) / height) * 2 + 1

    return [ x, y ]
  }
}
