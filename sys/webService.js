/* global Worker */

import { conversation } from './conversation.js';
import { log } from './log.js';

// Sets up a worker with conversational interface.
export const webService = async ({
  nodeWorker,
  webWorker,
  agent,
  workerType,
}) => {
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
  worker.onerror = (error) => {
    console.log(`QQ/webWorker/error: ${error}`);
  };
  return { ask };
};
