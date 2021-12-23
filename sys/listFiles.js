import * as fs from 'fs';

import { getFilesystem, qualifyPath } from './filesystem.js';
import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';

import { db } from './db.js';
import { listFiles as listEphemeralFiles } from './files.js';

const { promises } = fs;

const getFileLister = async ({ workspace }) => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async () => {
      const qualifiedPaths = new Set();
      const walk = async (path) => {
        for (const file of await promises.readdir(path)) {
          if (file.startsWith('.') || file === 'node_modules') {
            continue;
          }
          const subpath = `${path}${file}`;
          const stats = await promises.stat(subpath);
          if (stats.isDirectory()) {
            await walk(`${subpath}/`);
          } else {
            qualifiedPaths.add(subpath);
          }
        }
      };
      await walk('jsxcad/');
      listEphemeralFiles(qualifiedPaths);
      return qualifiedPaths;
    };
  } else if (isBrowser || isWebWorker) {
    // FIX: Make localstorage optional.
    return async () => {
      const qualifiedPaths = new Set(
        await db(`jsxcad/${workspace}/source`).keys(),
        await db(`jsxcad/${workspace}/config`).keys(),
        await db(`jsxcad/${workspace}/control`).keys()
      );
      listEphemeralFiles(qualifiedPaths);
      return qualifiedPaths;
    };
  } else {
    throw Error('Did not detect node, browser, or webworker');
  }
};

const getKeys = async ({ workspace }) => (await getFileLister({ workspace }))();

export const listFiles = async ({ workspace } = {}) => {
  if (workspace === undefined) {
    workspace = getFilesystem();
  }
  const prefix = qualifyPath('', workspace);
  const keys = await getKeys({ workspace });
  const files = [];
  for (const key of keys) {
    if (key && key.startsWith(prefix)) {
      files.push(key.substring(prefix.length));
    }
  }
  return files;
};
