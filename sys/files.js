import { qualifyPath } from './filesystem.js';

const files = new Map();
const fileCreationWatchers = new Set();
const fileDeletionWatchers = new Set();

export const runFileCreationWatchers = async (path, options) => {
  for (const watcher of fileCreationWatchers) {
    await watcher(path, options);
  }
};

export const runFileDeletionWatchers = async (path, options) => {
  for (const watcher of fileDeletionWatchers) {
    await watcher(path, options);
  }
};

export const getFile = async (options, unqualifiedPath) => {
  if (typeof unqualifiedPath !== 'string') {
    throw Error(`die: ${JSON.stringify(unqualifiedPath)}`);
  }
  const path = qualifyPath(unqualifiedPath, options.workspace);
  let file = files.get(path);
  if (file === undefined) {
    file = { path: unqualifiedPath, watchers: new Set(), storageKey: path };
    files.set(path, file);
    await runFileCreationWatchers(path, options);
  }
  return file;
};

export const listFiles = (set) => {
  for (const file of files.keys()) {
    set.add(file);
  }
};

export const deleteFile = async (options, unqualifiedPath) => {
  const path = qualifyPath(unqualifiedPath, options.workspace);
  let file = files.get(path);
  if (file !== undefined) {
    files.delete(path);
  } else {
    // It might not have been in the cache, but we still need to inform watchers.
    file = { path: unqualifiedPath, storageKey: path };
  }
  await runFileDeletionWatchers(path, options);
};

export const unwatchFiles = async (thunk) => {
  for (const file of files.values()) {
    file.watchers.delete(thunk);
  }
};

export const watchFileCreation = async (thunk) => {
  fileCreationWatchers.add(thunk);
  return thunk;
};

export const unwatchFileCreation = async (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};

export const watchFileDeletion = async (thunk) => {
  fileDeletionWatchers.add(thunk);
  return thunk;
};

export const unwatchFileDeletion = async (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};
