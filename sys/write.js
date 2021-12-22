import * as fs from 'fs';
import * as v8 from 'v8';

import { ensureFile, ensureQualifiedFile } from './files.js';
import { getFilesystem, qualifyPath } from './filesystem.js';
import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';
import { notifyFileChange, notifyFileCreation } from './broadcast.js';

import { addPending } from './pending.js';
import { db } from './db.js';
import { dirname } from 'path';

const { promises } = fs;
const { serialize } = v8;

const getFileWriter = () => {
  if (isNode) {
    return async (qualifiedPath, data, doSerialize) => {
      try {
        await promises.mkdir(dirname(qualifiedPath), { recursive: true });
      } catch (error) {
        throw error;
      }
      try {
        if (doSerialize) {
          data = serialize(data);
        }
        await promises.writeFile(qualifiedPath, data);
        // FIX: Do proper versioning.
        const version = 0;
        return version;
      } catch (error) {
        throw error;
      }
    };
  } else if (isBrowser || isWebWorker) {
    return async (qualifiedPath, data) => {
      return db(qualifiedPath).setItemAndIncrementVersion(qualifiedPath, data);
    };
  }
};

const fileWriter = getFileWriter();

export const writeNonblocking = (path, data, options = {}) => {
  const { workspace = getFilesystem() } = options;
  // Update in-memory cache immediately.
  ensureFile(path, workspace).data = data;
  // Schedule a deferred write to update persistent storage.
  addPending(write(path, data, options));
  return true;
};

export const write = async (path, data, options = {}) => {
  data = await data;

  if (typeof data === 'function') {
    // Always fail to write functions.
    return undefined;
  }

  const {
    doSerialize = true,
    ephemeral,
    workspace = getFilesystem(),
  } = options;

  const qualifiedPath = qualifyPath(path, workspace);
  const file = ensureQualifiedFile(path, qualifiedPath);

  if (!file.data) {
    await notifyFileCreation(path, workspace);
  }

  file.data = data;

  if (!ephemeral && workspace !== undefined) {
    file.version = await fileWriter(qualifiedPath, data, doSerialize);
  }

  // Let everyone else know the file has changed.
  await notifyFileChange(path, workspace);

  return true;
};
