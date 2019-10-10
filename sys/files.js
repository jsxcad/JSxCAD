import { getBase } from './filesystem';

const files = new Map();
const fileCreationWatchers = new Set();
const fileDeletionWatchers = new Set();

export const getFile = (options, unqualifiedPath) => {
  const path = `${getBase()}${unqualifiedPath}`;
  let file = files.get(path);
  if (file === undefined) {
    file = { path: unqualifiedPath, watchers: [], storageKey: `jsxcad/${path}` };
    files.set(path, file);
    for (const watcher of fileCreationWatchers) {
      watcher(options, file);
    }
  }
  return file;
};

export const deleteFile = (options, unqualifiedPath) => {
  const path = `${getBase()}${unqualifiedPath}`;
  let file = files.get(path);
  if (file !== undefined) {
    files.delete(path);
  } else {
    // It might not have been in the cache, but we still need to inform watchers.
    file = { path: unqualifiedPath, storageKey: `jsxcad/${path}` };
  }
  for (const watcher of fileDeletionWatchers) {
    watcher(options, file);
  }
};

export const watchFileCreation = (thunk) => {
  fileCreationWatchers.add(thunk);
  return thunk;
};

export const unwatchFileCreation = (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};

export const watchFileDeletion = (thunk) => {
  fileDeletionWatchers.add(thunk);
  return thunk;
};

export const unwatchFileDeletion = (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};
