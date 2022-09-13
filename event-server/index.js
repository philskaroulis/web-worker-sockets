/* =-=-=-=-=-=  EVENT SERVER  =-=-=-=-=-= */
const express = require('express')
const { WebSocketServer } = require('ws')
const { jsonRpc } = require('@local/json-rpc')

// EXPRESS SETUP
const app = express()
const port = 9876
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.get('/', (req, res) => {
  res.send('Hello from the event-server!')
})

// WS SETUP

const wsServer = new WebSocketServer({ server: server })

wsServer.on('connection', function connection(ws) {
  console.log("A new client connected.")

  const handleIncomingMessage = (bufferData) => {
    console.info('Server <- Worker: %s', bufferData)
    const payload = jsonRpc.deserialize(bufferData)
    const response = jsonRpc.serialize(doWork(payload))
    console.info("Server -> Worker: ", response)
    ws.send(response)
  }

  ws.on('message', handleIncomingMessage)

})

const doWork = (payload) => {
  if (payload.method) {
    switch (payload.method) {
      case 'addOne':
        return addOne(payload.params.data)
    }
  }
}

const addOne = (data) => {
  return { result: data + 1 }
}


// const WebSocket = require('ws')
// const wss = new WebSocket.Server({ port: 3001 })
// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log(`Received message => ${message}`)
//   })
//   ws.send('Hello! Message From Server!!')
// })

/*
var path = require('path')
var app = require('express')()
var ws = require('express-ws')(app)
app.get('/', (req, res) => {
  console.error('express connection')
  res.sendFile(path.join(__dirname, 'ws.html'))
})
app.ws('/', (s, req) => {
  console.error('websocket connection')
  for (var t = 0 t < 3 t++)
    setTimeout(() => s.send('message from server', () => { }), 1000 * t)
})
app.listen(3001, () => console.error('listening on http://localhost:3001/'))
console.error('websocket example')
*/

/*
const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const { v4: uuid } = require('uuid')

// Use JSON-RPC to communicate with websocket server
// {"id": 12, "method": "sum", "params": [2,3]}   // Request
// {"id": 12, "result": 5}                        // Response
// {"method": "hiya", "params": {"data": "hi"}}   // Notification frame
// {"id":1, "error": {"code": 500, "message": "oops..."}}  // Error

const prepJsonRpcResponse = (result) => {
  const id = uuid()
  return { id: id, result: result }
}
prepJsonRpcResponse('message from server')

app.use(function (req, res, next) {
  console.log('middleware')
  req.testing = 'testing'
  return next()
})

app.get('/', function(req, res, next){
  console.log('get route', req.testing)
  res.end()
})

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg)
  })
  console.log('socket', req.testing)
})

app.listen(3000, () => console.error('listening on http://localhost:3000/'))
*/


/*
const WebSocket = require("ws")
const express = require("express")
const app = express()
const path = require("path")

// Use JSON-RPC to communicate with websocket server
// {"id": 12, "method": "sum", "params": [2,3]}   // Request
// {"id": 12, "result": 5}                        // Response
// {"method": "hiya", "params": {"data": "hi"}}   // Notification frame
// {"id":1, "error": {"code": 500, "message": "oops..."}}  // Error

// const prepJsonRpcResponse = (result) => {
//   const id = uuid()
//   return { id: id, result: result }
// }


app.use("/", express.static(path.resolve(__dirname, "../client")))

// regular http server using node express which serves your webpage
const httpServer = app.listen(9876)

// a websocket server
const wsServer = new WebSocket.Server({
  noServer: true
})

// what should a websocket do on connection
wsServer.on("connection", function (ws) {

  console.log("on connection")

  // what to do on message event
  ws.on("message", function (msg) {
    console.log("on message")
    wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {     // check if client is ready
        // do work
        client.send(prepJsonRpcResponse(e.data + 1))
        // port.postMessage(e.data + 1)
        // prepJsonRpcResponse(e.data + 1)
      }
    })
  })

})

// handling upgrade(http to websocekt) event
httpServer.on('upgrade', async function upgrade(request, socket, head) {

  console.log("on upgrade")

  // accepts half requests and rejects half. Reload browser page in case of rejection
  // if (Math.random() > 0.5) {
  //   // proper connection close in case of rejection
  //   return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")
  // }

  // emit connection when request accepted
  wsServer.handleUpgrade(request, socket, head, function done(ws) {
    wsServer.emit('connection', ws, request)
  })

})

*/
