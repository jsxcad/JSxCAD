/* global self */

import { addPending } from './pending.js';
import { isWebWorker } from './browserOrNode.js';

const watchers = new Set();

export const log = async (entry) => {
  if (isWebWorker) {
    return addPending(self.tell({ op: 'log', entry }));
  }

  for (const watcher of watchers) {
    watcher(entry);
  }
};

export const watchLog = (thunk) => {
  watchers.add(thunk);
  return thunk;
};

export const unwatchLog = (thunk) => {
  watchers.delete(thunk);
};
