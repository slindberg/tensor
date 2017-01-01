const storageKey = 'tensor'

export function storeState(state) {
  localStorage[storageKey] = JSON.stringify(state)
}

export function loadState() {
  const serializedState = localStorage[storageKey]
  let state

  if (serializedState) {
    try {
      state = JSON.parse(serializedState)
    } catch(error) {
      console.debug(`Failed to deserialized state: ${serializedState}`)
    }
  }

  return state
}
