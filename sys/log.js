/* global self */

import { isWebWorker } from "./browserOrNode";

const watchers = new Set();

export const log = async (entry) => {
  if (isWebWorker) {
    return self.ask({ log: { entry } });
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
