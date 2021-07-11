import { isBrowser, isNode } from './browserOrNode.js';

import { conversation } from './conversation.js';
import { log } from './log.js';
import { nodeWorker } from './nodeWorker.js';
import { webWorker } from './webWorker.js';

const newWorker = (spec) => {
  if (isNode) {
    return nodeWorker(spec);
  } else if (isBrowser) {
    return webWorker(spec);
  } else {
    throw Error('die');
  }
};

// Sets up a worker with conversational interface.
export const createService = (spec, worker) => {
  try {
    let service = {};
    service.released = false;
    if (worker === undefined) {
      service.worker = newWorker(spec);
    } else {
      service.worker = worker;
    }
    service.say = (message, transfer) => {
      try {
        service.worker.postMessage(message, transfer);
      } catch (e) {
        console.log(e.stack);
        throw e;
      }
    };
    const { ask, hear } = conversation({ agent: spec.agent, say: service.say });
    service.ask = ask;
    service.hear = hear;
    service.tell = (statement) => service.say({ statement });
    service.worker.onmessage = ({ data }) => service.hear(data);
    service.worker.onerror = (error) => {
      console.log(`QQ/worker/error: ${error}`);
    };
    service.release = (terminate) => {
      if (!service.released) {
        service.released = true;
        if (spec.release) {
          spec.release(spec, service, terminate);
        } else {
          service.terminate();
        }
      }
    };
    service.releaseWorker = () => {
      if (service.worker) {
        const worker = service.worker;
        service.worker = undefined;
        return worker;
      } else {
        return undefined;
      }
    };
    service.terminate = () => service.release(true);
    return service;
  } catch (e) {
    log({ op: 'text', text: '' + e, level: 'serious', duration: 6000000 });
    console.log(e.stack);
    throw e;
  }
};
