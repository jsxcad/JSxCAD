import * as fs from 'fs';
import * as v8 from 'v8';

import { getFilesystem, qualifyPath } from './filesystem.js';
import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';
import { notifyFileChange, notifyFileCreation } from './broadcast.js';

import { ErrorWouldBlock } from './error.js';
import { addPending } from './pending.js';
import { db } from './db.js';
import { dirname } from 'path';
import { ensureQualifiedFile } from './files.js';

const { promises } = fs;
const { serialize } = v8;

const getFileWriter = () => {
  if (isNode) {
    return async (qualifiedPath, data) => {
      try {
        await promises.mkdir(dirname(qualifiedPath), { recursive: true });
      } catch (error) {
        throw error;
      }
      try {
        await promises.writeFile(qualifiedPath, serialize(data));
        // FIX: Do proper versioning.
        const version = 0;
        return version;
      } catch (error) {
        console.dir(data, { depth: null });
        throw error;
      }
    };
  } else if (isBrowser || isWebWorker) {
    return async (qualifiedPath, data) => {
      if (navigator.storage && navigator.storage.estimate) {
        const { quota, usage } = await navigator.storage.estimate();
        console.log(
          `QQ/quota: ${
            Number(usage / quota).toFixed(2) * 100
          }% ${usage} of ${quota}`
        );
      }
      return db(qualifiedPath).setItemAndIncrementVersion(qualifiedPath, data);
    };
  }
};

const fileWriter = getFileWriter();

export const writeNonblocking = (path, data, options = {}) => {
  const { workspace = getFilesystem(), errorOnBlocking = true } = options;
  const qualifiedPath = qualifyPath(path, workspace);
  const file = ensureQualifiedFile(path, qualifiedPath);
  if (file.data === data) {
    // This has already been written.
    return true;
  }
  // Schedule a deferred write to update persistent storage.
  addPending(write(path, data, options));
  if (errorOnBlocking) {
    throw new ErrorWouldBlock(`Would have blocked on write ${path}`);
  }
};

export const write = async (path, data, options = {}) => {
  while (data.then) {
    data = await data;
  }

  if (typeof data === 'function') {
    // Always fail to write functions.
    return undefined;
  }

  const { ephemeral, workspace = getFilesystem() } = options;

  const qualifiedPath = qualifyPath(path, workspace);
  const file = ensureQualifiedFile(path, qualifiedPath);

  if (file.data === undefined) {
    await notifyFileCreation(path, workspace);
  }

  file.data = data;

  if (!ephemeral && workspace !== undefined) {
    try {
      file.version = await fileWriter(qualifiedPath, data);
    } catch (e) {
      throw e;
    }
  }

  // Let everyone else know the file has changed.
  await notifyFileChange(path, workspace);

  return true;
};
