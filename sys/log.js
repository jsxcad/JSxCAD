import { addPending } from './pending.js';
import { isWebWorker } from './browserOrNode.js';
import self from './self.js';

const watchers = new Set();

export const log = async (entry) => {
  if (isWebWorker) {
    return addPending(self.tell({ op: 'log', entry }));
  }

  for (const watcher of watchers) {
    watcher(entry);
  }
};

export const logInfo = (source, text) =>
  log({ type: 'info', source, text, id: self && self.id });

export const logError = (source, text) =>
  log({ type: 'error', source, text, id: self && self.id });

export const watchLog = (thunk) => {
  watchers.add(thunk);
  return thunk;
};

export const unwatchLog = (thunk) => {
  watchers.delete(thunk);
};
