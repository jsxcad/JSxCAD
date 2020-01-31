/* global self */

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { deleteFile as deleteCachedFile } from './files';
import localForage from 'localforage';
import { qualifyPath } from './filesystem';

const { promises } = fs;

const getFileDeleter = async () => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (path) => {
      return promises.unlink(qualifyPath(path));
    };
  } else if (isBrowser) {
    return async (path) => {
      await localForage.removeItem(qualifyPath(path));
    };
  } else {
    throw Error('die');
  }
};

export const deleteFile = async (options, path) => {
  if (isWebWorker) {
    return self.ask({ deleteFile: { options, path } });
  }
  const deleter = await getFileDeleter();
  await deleter(path);
  await deleteCachedFile(options, path);
};
