import clean from './clean';
import copy from './copy';
import bundle from './bundle';
import run from './run';
import runServer from './runServer';

const DEBUG = !process.argv.includes('--release');

async function start() {
  await run(clean);
  await run(copy);
  await run(bundle);

  // runServer is a callback function, not a promise
  let server // ChildProcess object from child_process.spawn('node', ...)
  await new Promise((resolve, reject) => {
    /*
    runServer is not a promise but a function with callback
    a cb can be provided and is invoked on runServer detecting that server started
    cb(err, string) (there is no error return)
    runServer will listen to the new process stdout and stderr, so this process will not exit
    if runServer executed without exception, resolve and exit the launcher
    */
    server = runServer((e, text) => console.log(`text: ${text}`))
    resolve('ok')
  })
}

export default start;
