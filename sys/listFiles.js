import * as fs from 'fs';

import {
  getFilesystem,
  qualifyPath
} from './filesystem';

import {
  isBrowser,
  isNode
} from './browserOrNode';

import {
  listFiles as listEphemeralFiles,
  watchFileCreation,
  watchFileDeletion
} from './files';

import localForage from 'localforage';

import { toByteArray } from 'base64-js';

const { promises } = fs;

const getFileLister = async () => {
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
  } else if (isBrowser) {
    // FIX: Make localstorage optional.
    return async () => {
      const qualifiedPaths = new Set(await localForage.keys());
      listEphemeralFiles(qualifiedPaths);
      return qualifiedPaths;
    };
  } else {
    throw Error('die');
  }
};

let cachedKeys;

const updateCachedKeys = (options = {}, file) => cachedKeys.add(file.storageKey);
const deleteCachedKeys = (options = {}, file) => cachedKeys.delete(file.storageKey);

const getKeys = async () => {
  if (cachedKeys === undefined) {
    const listFiles = await getFileLister();
    cachedKeys = await listFiles();
    watchFileCreation(updateCachedKeys);
    watchFileDeletion(deleteCachedKeys);
  }
  return cachedKeys;
};

export const fixKeys = async () => {
  for (const key of cachedKeys) {
    if (key.startsWith(`jsxcad/`)) {
      const value = await localForage.getItem(key);
      if (typeof old === 'string') {
        console.log(`QQ/fixKeys: ${key}`);
        const decoded = await localForage.setItem(key, toByteArray(value));
        await localForage.setItem(decoded);
      }
    }
  }
  console.log(`QQ/fixKeys/done`);
};

export const listFilesystems = async () => {
  const keys = await getKeys();
  const filesystems = new Set();
  for (const key of keys) {
    if (key.startsWith('jsxcad/')) {
      const [, filesystem] = key.split('/');
      filesystems.add(filesystem);
    }
  }
  return [...filesystems];
};

export const listFiles = async ({ project } = {}) => {
  if (project === undefined) {
    project = getFilesystem();
  }
  const prefix = qualifyPath('', project);
  const keys = await getKeys();
  const files = [];
  for (const key of keys) {
    if (key.startsWith(prefix)) {
      files.push(key.substring(prefix.length));
    }
  }
  return files;
};
