/* =-=-=-=-=-=  CONSUMING APP  =-=-=-=-=-= */

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'


// =-=-= START =-=-=

import { eventClient } from '@local/event-client'

// The eventClient offers a "channel" for communication.
// We use "channel.onmessage" to listen for messages from the eventClient.
// We use "channel.postMessage" to send messages to the eventClient.
const channel = eventClient.getChannel()

// handle a message from the eventClient
channel.onmessage = (event) => {
  console.info("App <- Client: ", event.data)
}

// send a message to the eventClient
const addOne = function (amount) {
  console.info("App -> Client: ", amount)
  channel.postMessage(amount)
}

window.addEventListener("beforeunload", function (e) {
  channel.close()
  return ''
})

// do something
addOne(100)

// =-=-= END =-=-=



const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
