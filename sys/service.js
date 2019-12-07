/* global Worker */

import { isBrowser, isNode } from './browserOrNode';
import { conversation } from './conversation';
import { log } from './log';

// Sets up a worker with conversational interface.
export const createService = async ({ nodeWorker, webWorker, agent, workerType }) => {
  if (isNode) {
    // const { Worker } = await import('worker_threads');
    const { Worker } = require('worker_threads');
    const worker = new Worker(nodeWorker);
    const say = (message) => worker.postMessage(message);
    const { ask, hear } = conversation({ agent, say });
    const stop = async () => {
      return new Promise((resolve, reject) => {
        worker.terminate((err, exitCode) => {
          if (err) {
            reject(err);
          } else {
            resolve(exitCode);
          }
        });
      });
    };
    worker.on('message', hear);
    return { ask, stop };
  } else if (isBrowser) {
    let worker;
    try {
      worker = new Worker(webWorker, { type: workerType });
    } catch (e) {
      log({ op: 'text', text: '' + e, level: 'serious', duration: 6000000 });
      throw Error('die');
    }
    const say = (message) => worker.postMessage(message);
    const { ask, hear } = conversation({ agent, say });
    worker.onmessage = ({ data }) => hear(data);
    return { ask };
  } else {
    throw Error('die');
  }
};
