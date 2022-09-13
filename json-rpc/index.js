// This node package implements a helper for JSON-RPC 2.0 communications
// https://www.jsonrpc.org/specification
// 
// {"id": 12, "method": "sum", "params": [2,3]}   // Request
// {"id": 12, "result": 5}                        // Response
// {"method": "hiya", "params": {"data": "hi"}}   // Notification frame
// {"id":1, "error": {"code": 500, "message": "oops..."}}  // Error

const { v4: uuid } = require('uuid')

const jsonRpc = (() => {

  // PUBLIC: Internal

  // serialize the json rpc object
  const serialize = (data) => {
    data.jsonrpc = "2.0"
    data.id = uuid()
    return JSON.stringify(data)
  }

  // deserialize the json rpc object
  const deserialize = (data) => {
    return JSON.parse(data.toString())
  }

  // PUBLIC: API
  return {
    serialize: (data) => serialize(data),
    deserialize: (data) => deserialize(data),
  }
})()

module.exports = { jsonRpc }
