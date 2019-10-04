import { getBase } from './filesystem';

const files = new Map();
const fileCreationWatchers = new Set();

export const getFile = (options, unqualifiedPath) => {
  const path = `${getBase()}${unqualifiedPath}`;
  let file = files.get(path);
  if (file === undefined) {
    file = { path: unqualifiedPath, watchers: [], storageKey: `file/${path}` };
    files.set(path, file);
    for (const watcher of fileCreationWatchers) {
      watcher(options, file);
    }
  }
  return file;
};

export const watchFileCreation = (thunk) => {
  fileCreationWatchers.add(thunk);
  return thunk;
};

export const unwatchFileCreation = (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};
