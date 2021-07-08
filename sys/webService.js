/* global Worker */

import { acquireService, releaseService } from './servicePool.js';

import { conversation } from './conversation.js';
import { log } from './log.js';

// Sets up a worker with conversational interface.
export const webService = async ({
  nodeWorker,
  webWorker,
  agent,
  workerType,
}) => {
  try {
    return await acquireService(
      { webWorker, type: workerType },
      ({ webWorker, type }) => {
        const worker = new Worker(webWorker, { type: workerType });
        const say = (message, transfer) =>
          worker.postMessage(message, transfer);
        const { ask, hear } = conversation({ agent, say });
        const tell = (statement) => say({ statement });
        const terminate = async () => {
          worker.terminate();
          releaseService(
            { webWorker, type: workerType },
            service,
            /* terminated= */ true
          );
        };
        worker.onmessage = ({ data }) => hear(data);
        worker.onerror = (error) => {
          console.log(`QQ/webWorker/error: ${error}`);
        };
        const service = { ask, tell, terminate };
        service.release = async () =>
          releaseService({ webWorker, type: workerType }, service);
        return service;
      }
    );
  } catch (e) {
    log({ op: 'text', text: '' + e, level: 'serious', duration: 6000000 });
    throw Error('die');
  }
};
