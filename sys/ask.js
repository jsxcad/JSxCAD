/* global self */

import { isWebWorker } from './browserOrNode';

let handleAskUser;

const askUser = async (parameters, identifier, options) => {
  if (handleAskUser) {
    return handleAskUser(parameters, identifier, options);
  } else {
    return { identifier, value: '', type: 'string' };
  }
};

export const ask = async (identifier, options = {}) => {
  if (isWebWorker) {
    return self.ask({ ask: { identifier, options } });
  }

  return askUser(identifier, options);
};

export const setHandleAskUser = (handler) => {
  handleAskUser = handler;
};
