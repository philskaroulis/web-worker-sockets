export default () => {

  self.onconnect = function (event) {

    // EVENT HANDLERS

    const handleError = (event) => {
      console.log(`[error] ${event.message}`)
    }

    const handleOpen = (event) => {
      console.log("[open] Connection established")
    }

    const handleClose = (event) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died')
      }
    }

    const handleMessageFromServer = (event) => {
      // pass message from server to client
      console.info("Worker <- Server: ", event.data)
      console.info("Worker -> Client: ", event.data)
      worker.postMessage(event.data)
    }

    const handleMessageFromClient = (event) => {
      // pass message from client to server
      console.info("Worker <- Client: ", event.data)
      console.info("Worker -> Server: ", event.data)
      safeSend(event.data)
    }

    // CONFIGURE WORKER (CONDUIT BETWEEN CLIENT AND SERVER)
    const worker = event.ports[0]
    worker.onmessage = handleMessageFromClient

    // CONFIGURE SOCKET

    // const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
    // console.info(`${protocol}://${location.host}:9876/websocket`)
    // ERRORS OUT: no "window"

    const socket = new WebSocket("ws://localhost:9876/websocket")
    socket.onerror = handleError
    socket.onopen = handleOpen
    socket.onclose = handleClose
    // note: since we are using onmessage, 
    // the start() method is called implicitly
    socket.onmessage = handleMessageFromServer

    const safeSend = (data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data)
      } else if (socket.readyState == WebSocket.CONNECTING) {
        // Wait for the open event, maybe do something with promises
        // depending on your use case. I believe in you developer!
        socket.addEventListener('open', () => safeSend(data))
      }
    }


  }

}
