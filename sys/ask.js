/* global self */

import { addPending } from './pending.js';
import { isWebWorker } from './browserOrNode.js';

let handleAskUser;

const askUser = async (identifier, options) => {
  if (handleAskUser) {
    return handleAskUser(identifier, options);
  } else {
    return { identifier, value: '', type: 'string' };
  }
};

export const ask = async (identifier, options = {}) => {
  if (isWebWorker) {
    return addPending(self.ask({ op: 'ask', identifier, options }));
  }

  return askUser(identifier, options);
};

export const setHandleAskUser = (handler) => {
  handleAskUser = handler;
};
