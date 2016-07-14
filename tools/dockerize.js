/*
© 2016-present Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import clean from './clean'
import copy from './copy'
import bundle from './bundle'
import run from './run'
import {Dockerizer} from './lib/dockerizer'

async function dockerize(options) {
  await run(clean)
  await run(copy)
  process.argv.push('--release')
  await run(bundle)

  const dockerizer = new Dockerizer({
    dockerfile: './build/content/Dockerfile',
    context: './build',
  })
  const imageId = await run(dockerizer.build.bind(dockerizer))
  await run(dockerizer.run.bind(dockerizer), {imageId: imageId, keyPress: true})
  await run(dockerizer.stopAll.bind(dockerizer), imageId)
}

export default dockerize
