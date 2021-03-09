import { isBrowser, isNode } from './browserOrNode.js';

import { nodeService } from './nodeService.js';
import { webService } from './webService.js';

// Sets up a worker with conversational interface.
export const createService = async ({
  nodeWorker,
  webWorker,
  agent,
  workerType,
}) => {
  if (isNode) {
    return nodeService({ nodeWorker, webWorker, agent, workerType });
  } else if (isBrowser) {
    return webService({ nodeWorker, webWorker, agent, workerType });
  } else {
    throw Error('die');
  }
};

export const askService = (spec, question) => {
  let cancel;
  const promise = new Promise((resolve, reject) => {
    let ask, release, terminate;
    createService(spec)
      .then((service) => {
        ask = service.ask;
        release = service.release;
        terminate = service.terminate;
        cancel = () => {
          terminate();
          reject(Error('Terminated'));
        };
      })
      .then(() => ask(question))
      .then((answer) => {
        if (release) {
          release();
        }
        resolve(answer);
      })
      .catch((error) => {
        console.log(`QQ/askService: ${error.stack}`);
      });
    cancel = () => {
      reject(Error('Cancelled'));
    };
  });
  promise.cancel = cancel;
  return promise;
};
