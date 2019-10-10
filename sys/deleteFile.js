/* global self */

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { deleteFile as deleteCachedFile } from './files';
import { getBase } from './filesystem';
import localForage from 'localforage';

const { promises } = fs;

const getFileDeleter = async (prefix) => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (path) => {
      return promises.unlink(`${prefix}${path}`);
    };
  } else if (isBrowser) {
    return async (path) => {
      await localForage.removeItem(`${prefix}${path}`);
    };
  } else {
    throw Error('die');
  }
};

export const deleteFile = async (options, path) => {
  if (isWebWorker) {
    return self.ask({ deleteFile: { options, path } });
  }
  const deleter = await getFileDeleter('jsxcad/');
  const base = getBase();
  await deleter(`${base}${path}`);
  deleteCachedFile(options, path);
};
