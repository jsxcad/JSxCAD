import { notifyFileCreation } from './broadcast.js';
import { qualifyPath } from './filesystem.js';
import { watchFileDeletion } from './watchers.js';

const files = new Map();

export const getQualifiedFile = async (
  options,
  unqualifiedPath,
  qualifiedPath
) => {
  let file = files.get(qualifiedPath);
  // Accessing a file counts as creation.
  if (file === undefined) {
    file = { path: unqualifiedPath, storageKey: qualifiedPath };
    files.set(qualifiedPath, file);
    await notifyFileCreation(qualifiedPath, options);
  }
  return file;
};

export const getFile = (options, unqualifiedPath) => {
  if (typeof unqualifiedPath !== 'string') {
    throw Error(`die: ${JSON.stringify(unqualifiedPath)}`);
  }
  const qualifiedPath = qualifyPath(unqualifiedPath, options.workspace);
  return getQualifiedFile(options, unqualifiedPath, qualifiedPath);
};

export const listFiles = (set) => {
  for (const file of files.keys()) {
    set.add(file);
  }
};

watchFileDeletion((qualifiedPath, options) => {
  files.delete(qualifiedPath);
});
