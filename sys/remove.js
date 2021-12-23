import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';

import { db } from './db.js';
import { notifyFileDeletion } from './broadcast.js';
import { qualifyPath } from './filesystem.js';

const { promises } = fs;

const getPersistentFileDeleter = () => {
  if (isNode) {
    return async (qualifiedPath) => {
      return promises.unlink(qualifiedPath);
    };
  } else if (isBrowser || isWebWorker) {
    return async (qualifiedPath) => {
      await db(qualifiedPath).removeItem(qualifiedPath);
    };
  } else {
    throw Error('Expected node or browser or web worker');
  }
};

const persistentFileDeleter = getPersistentFileDeleter();

export const remove = async (path, { workspace } = {}) => {
  await persistentFileDeleter(qualifyPath(path, workspace));
  await notifyFileDeletion(path, workspace);
};
