/*
© 2016-present Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {spawn} from 'child_process'
import {default as whichCb} from 'which'
import bluebird from 'bluebird'
import readline from 'readline'

export class Dockerizer {
  constructor(o) {
    Object.assign(this, o)
  }

  async build() {
    await this.whichDocker()
    return await new Promise((resolve, reject) => {
      /*
      downloading a docker image can take a minutes
      users need to see streaming output so they do not think it crashed
      use spawn to get streaming stdio
      */
      let anImageId
      const buildMarker = 'Successfully built '
      const bmLength = buildMarker.length
      const dockerArgs = ['build', '--file', this.dockerfile, this.context]
      const cp = spawn(this.dockerExecutable, dockerArgs, {stdio: ['ignore', 'pipe', 2]})
        .once('close', status => {
          let err
          if (status === 0) {
            if (anImageId) resolve(anImageId)
            else err = new Error('Unable to parse docker image id')
          } else err = new Error(`status code: ${status} command: ${this.dockerExecutable} ${dockerArgs.join(' ')}`)
          if (err) reject(err)
      })
      cp.stdout.pipe(process.stdout)
      cp.stdout.setEncoding('utf-8')
      const rl = readline.createInterface({input: cp.stdout})
        .on('line', line =>
          line.substring(0, bmLength) === buildMarker &&
            (anImageId = line.substring(bmLength))
        )
    })
  }

  async run(options) {
    await this.whichDocker()
    if (typeof options === 'string') options = {imageId: options}
    return await new Promise((resolve, reject) => {
      let rl
      const dockerArgs = ['run', '--publish=3002:3002', options.imageId]
      const cp = spawn(this.dockerExecutable, dockerArgs, {stdio: ['ignore', 1, 2]})
        .once('close', status => {
          if (rl) rl.close()
          if (status === 0) resolve('exit')
          else reject(new Error(`status code: ${status} command: ${this.dockerExecutable} ${dockerArgs.join(' ')}`))
        })
      if (options.keyPress) {
        console.log('Hit Enter to exit')
        rl = readline.createInterface({input: process.stdin})
          .once('line', line => {
            rl.close()
            resolve('keypress')
          })
      }
    })
  }

  async stopAll(imageId) { // returns array of string stopped container ids
    await this.whichDocker()

    let containers = await new Promise((resolve, reject) => {
      let stdoutEnd
      let cpEnd
      let stdout = ''
      const dockerArgs = ['ps', '--quiet', '--filter', 'ancestor=' + imageId]
      const cp = spawn(this.dockerExecutable, dockerArgs, {stdio: ['ignore', 'pipe', 2]})
        .once('close', status => {
          if (status === 0) {
            if (stdoutEnd) resolve(stdout)
            else cpEnd = true
          } else reject(new Error(`status code: ${status} command: ${this.dockerExecutable} ${dockerArgs.join(' ')}`))
        })
      cp.stdout.setEncoding('utf-8')
      cp.stdout.on('data', str => stdout += str)
      cp.stdout.once('close', () => {
        if (cpEnd) resolve(stdout)
        else stdoutEnd = true
      })
    })
    if (containers.slice(-1) === '\n') containers = containers.slice(0, -1)
    if ((containers = containers.split('\n')).length) await this.stop(containers)

    return containers
  }

  async stop(containerIds) {
    await this.whichDocker()
    return await new Promise((resolve, reject) => {
      const dockerArgs = ['stop'].concat(containerIds)
      const cp = spawn(this.dockerExecutable, dockerArgs, {stdio: ['ignore', 1, 2]})
        .once('close', status => status === 0 ?
            resolve('ok') :
            reject(new Error(`status code: ${status} command: ${this.dockerExecutable} ${dockerArgs.join(' ')}`))
        )
    })
  }

  async whichDocker() {
    if (!this.dockerExecutable) {
      const which = bluebird.promisify(whichCb)
      this.dockerExecutable = await which('docker')
    }
  }
}
