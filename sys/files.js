import { qualifyPath } from './filesystem.js';
import { watchFileDeletion } from './watchers.js';

const files = new Map();

export const clearFileCache = () => {
  files.clear();
};

// Do we need the ensureFile functions?
export const ensureQualifiedFile = (path, qualifiedPath) => {
  let file = files.get(qualifiedPath);
  // Accessing a file counts as creation.
  if (file === undefined) {
    file = { path, storageKey: qualifiedPath };
    files.set(qualifiedPath, file);
  }
  return file;
};

export const ensureFile = (path, workspace) => {
  if (typeof path !== 'string') {
    throw Error(`die: ${JSON.stringify(path)}`);
  }
  const qualifiedPath = qualifyPath(path, workspace);
  return ensureQualifiedFile(path, qualifiedPath);
};

export const getQualifiedFile = (qualifiedPath) => files.get(qualifiedPath);

export const getFile = (path, workspace) =>
  getQualifiedFile(qualifyPath(path, workspace));

export const listFiles = (set) => {
  for (const file of files.keys()) {
    set.add(file);
  }
};

watchFileDeletion((path, workspace) => {
  const qualifiedPath = qualifyPath(path, workspace);
  const file = files.get(qualifiedPath);
  if (file) {
    file.data = undefined;
  }
  files.delete(qualifiedPath);
});
