import * as fs from 'fs';
import * as v8 from 'v8';

import { getFilesystem, qualifyPath } from './filesystem.js';
import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';

import { db } from './db.js';
import { dirname } from 'path';
import { getFile } from './files.js';
import { info } from './emit.js';
import { touch } from './touch.js';

const { promises } = fs;
const { serialize } = v8;

export const writeFile = async (options, path, data) => {
  data = await data;

  const {
    doSerialize = true,
    ephemeral,
    workspace = getFilesystem(),
  } = options;
  info(`Write ${path}`);
  const file = await getFile(options, path);
  file.data = data;

  if (!ephemeral && workspace !== undefined) {
    const qualifiedPath = qualifyPath(path, workspace);
    if (isNode) {
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
    } else if (isBrowser || isWebWorker) {
      await db(qualifiedPath).setItem(qualifiedPath, data);
    }

    // Let everyone know the file has changed.
    await touch(path, { workspace, clear: false });
  }

  for (const watcher of file.watchers) {
    await watcher(options, file);
  }

  return true;
};

export const write = async (path, data, options = {}) => {
  if (typeof data === 'function') {
    // Always fail to write functions.
    return undefined;
  }
  return writeFile(options, path, data);
};
