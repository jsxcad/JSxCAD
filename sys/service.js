/* global Worker */

import { isBrowser, isNode } from './browserOrNode.js';

import { conversation } from './conversation.js';
import { nodeService } from './nodeService.js';
import { webService } from './webService.js';
import { log } from './log.js';

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
