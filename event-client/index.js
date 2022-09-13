/* =-=-=-=-=-=  EVENT CLIENT  =-=-=-=-=-= */

import { v4 as uuid } from 'uuid'
import workerScript from './worker'
import { jsonRpc } from '@local/json-rpc'

const eventClient = (() => {

  // CHECK COMPATIBILITY
  const compatible = !!window.SharedWorker && !!window.BroadcastChannel
  if (!compatible) {
    throw Error("Version of browser is too old. Missing SharedWorker or BroadcastChannel.")
  }

  // PRIVATE: CHANNEL MANAGEMENT
  // TODO: Are there benefits in using "Channel Messaging API" instead of BroadcastChannel API?
  const commonTopic = uuid()
  const channel = new BroadcastChannel(commonTopic)
  const getChannel = () => {
    return new BroadcastChannel(commonTopic)
  }

  // PRIVATE: WORKER MANAGEMENT

  const getSharedWorker = (script) => {
    // This tricky logic is neccesary to access the worker script
    // AFTER a build has been produced. Without this, the worker 
    // script would have to live in the "public" folder.
    const code = script.toString()
    const blob = new Blob([`(${code})()`])
    const workerInstance = new SharedWorker(URL.createObjectURL(blob), `worker-${uuid()}`)
    return workerInstance.port
  }

  const worker = getSharedWorker(workerScript)
  // note: since we are using onmessage, 
  // the start() method is called implicitly

  worker.onerror = (e) => {
    // TODO: Datadog logging
    console.error('Line ', e.lineno, ' in ', e.filename, ': ', e.message)
    /*
      Exceptions:

      SecurityError DOMException
      Thrown if the document is not allowed to start workers, for example if the URL has an invalid syntax or if the same-origin policy is violated.

      NetworkError DOMException
      Thrown if the MIME type of the worker script is incorrect. It should always be text/javascript (for historical reasons other JavaScript MIME types may be accepted).

      SyntaxError DOMException
      Thrown if aURL cannot be parsed.    
    */
  }

  // PRIVATE: WORKER-TO-CHANNEL INTERFACE

  // pass message from channel to worker
  channel.onmessage = (event) => {
    console.info("Client <- App: ", event.data)
    const payload = jsonRpc.serialize({ method: 'addOne', params: { data: event.data } })

    console.info("Client -> Worker: ", payload)
    worker.postMessage(payload)
  }

  // pass message from worker to channel
  worker.onmessage = (event) => {
    console.info("Client <- Worker: ", event.data)
    const payload = jsonRpc.deserialize(event.data)

    console.info("Client -> App: ", payload.result)
    channel.postMessage(payload.result)
  }

  // PUBLIC: API
  return {
    getChannel: () => getChannel(),
  }
})()

export { eventClient }
