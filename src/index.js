import React from 'react'
import { createStore } from 'redux'
import { render } from 'react-dom'
import rootReducer from './reducers/root'
import { Provider } from 'react-redux'
import App from './components/App'
import './index.css'

const store = createStore(
  rootReducer,
  // initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
