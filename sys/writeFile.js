/* global self */

import * as fs from 'fs';
import * as v8 from 'v8';

import { getBase, getFilesystem, qualifyPath, setupFilesystem } from './filesystem';
import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { db } from './db';
import { dirname } from 'path';
import { getFile } from './files';
import { log } from './log';

const { promises } = fs;
const { serialize } = v8;

// FIX Convert data by representation.

export const writeFile = async (options, path, data) => {
  data = await data;
  // FIX: Should be checking for a proxy fs, not webworker.
  // if (false && isWebWorker) {
  //  return self.ask({ writeFile: { options: { ...options, as: 'bytes' }, path, data: await data } });
  // }

  const { doSerialize = true, ephemeral, project = getFilesystem() } = options;
  let originalProject = getFilesystem();
  if (project !== originalProject) {
    log({ op: 'text', text: `Write ${path} of ${project}` });
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: project });
  }

  await log({ op: 'text', text: `Write ${path}` });
  const file = await getFile(options, path);
  file.data = data;

  for (const watcher of file.watchers) {
    await watcher(options, file);
  }

  const base = getBase();
  if (!ephemeral && base !== undefined) {
    const persistentPath = qualifyPath(path);
    if (isNode) {
      try {
        await promises.mkdir(dirname(persistentPath), { recursive: true });
      } catch (error) {
      }
      try {
        if (doSerialize) {
          data = serialize(data);
        }
        await promises.writeFile(persistentPath, data);
      } catch (error) {
      }
    } else if (isBrowser || isWebWorker) {
      await db().setItem(persistentPath, data);
      if (isWebWorker) {
        await self.ask({ touchFile: { path, workspace: project } });
      }
    }
  }

  if (project !== originalProject) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalProject });
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
