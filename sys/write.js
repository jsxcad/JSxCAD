import * as fs from 'fs';
import * as v8 from 'v8';

import { getFilesystem, qualifyPath } from './filesystem.js';
import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';

import { db } from './db.js';
import { dirname } from 'path';
import { getQualifiedFile } from './files.js';
import { notifyFileChange } from './broadcast.js';

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
  const file = await getQualifiedFile(options, path, qualifiedPath);

  file.data = data;

  if (!ephemeral && workspace !== undefined) {
    file.version = await fileWriter(qualifiedPath, data, doSerialize);
  }

  // Let everyone else know the file has changed.
  await notifyFileChange(qualifiedPath, { workspace });

  return true;
};
