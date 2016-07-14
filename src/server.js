/*
© 2016-present Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import express from 'express'

class RestServer {
  constructor() {
    this.throwError = this.throwError.bind(this)
    new Promise((resolve, reject) => {
      this.app = express()
      this.app.get('*', this.handleRequest.bind(this))
      this.server = this.app.listen(3002, '0.0.0.0', e => {
        if (!e) resolve(this.server.address())
        else reject(e)
      })
    }).then(this.serverIsUp.bind(this))
    .catch(e => process.nextTick(this.throwError, e))
  }

  serverIsUp(a) {
    console.log(`Listening on http://${a.address}:${a.port}`)
  }

  handleRequest(req, res) {
    res.end(new Date().toISOString())
  }

  throwError(e) {
    console.error('throwError invoked')
    throw e
  }
}

new RestServer
