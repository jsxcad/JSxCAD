import { isBrowser, isNode } from './browserOrNode.js';

import { createConversation } from './conversation.js';
import { getConfig } from './config.js';
import { getLocalFilesystems } from './filesystem.js';
import { log } from './log.js';
import { nodeWorker } from './nodeWorker.js';
import { webWorker } from './webWorker.js';

let serviceId = 0;

export const newWorker = (spec) => {
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
    service.id = serviceId++;
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
    service.conversation = createConversation({
      agent: spec.agent,
      say: service.say,
    });
    const { ask, hear, waitToFinish } = service.conversation;
    service.waitToFinish = () => {
      service.waiting = true;
      return waitToFinish();
    };
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
          const worker = service.releaseWorker();
          if (worker) {
            worker.terminate();
          }
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
    service.tell({ op: 'sys/attach', config: getConfig(), id: service.id });
    for (const [path, handle] of getLocalFilesystems()) {
      service.tell({ op: 'sys/setLocalFilesystemHandle', path, handle });
    }
    return service;
  } catch (e) {
    log({ op: 'text', text: '' + e, level: 'serious', duration: 6000000 });
    console.log(e.stack);
    throw e;
  }
};
