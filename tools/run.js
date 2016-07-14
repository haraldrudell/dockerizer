/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

/*
fn: either:
- a function returning a promise
- an object with property default being a function returning a promise
options: an optional argument provided to the function returning a promise

return value: the promise
*/
function run(fn, options) {
  const task = typeof fn.default === 'undefined' ? fn : fn.default;
  const start = new Date();
  console.log(
    `[${format(start)}] Starting '${task.name}${options ? `(${options})` : ''}'...`
  );
  return task(options).then(r => {
    const end = new Date();
    const time = end.getTime() - start.getTime();
    console.log(
      `[${format(end)}] Finished '${task.name}${options ? `(${options})` : ''}' after ${time} ms`
    );
    return r
  });
}

/*
When run.js is invoked on the command line with one argument
A .js file by that name is required, expected to have a function returning a promise as its default export.
- on reject or exception, a stack trace is printed to standard error
- if run.js is invoked without arguments, it does nothing
*/
if (process.mainModule.children.length === 0 && process.argv.length > 2) {
  delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle
  const module = require(`./${process.argv[2]}.js`).default;
  run(module).catch(err => console.error(err.stack));
}

export default run;
