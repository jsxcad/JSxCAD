import * as fs from 'fs';

import { db, oldDb } from './db';

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
      const qualifiedPaths = new Set(await db().keys());
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

export const fixKeys = async () => {
  if (isBrowser) {
    const dbKeys = new Set(await db().keys());
    for (const key of await oldDb().keys()) {
      if (!dbKeys.has(key)) {
        let value = await oldDb().getItem(key);
        console.log(`QQ/fixKeys: ${key}`);
        if (typeof value === 'string') {
          value = toByteArray(value);
        }
        await db().setItem(key, value);
      }
    }
    console.log(`QQ/fixKeys/done`);
  }
};

const getKeys = async () => {
  if (cachedKeys === undefined) {
    const listFiles = await getFileLister();
    cachedKeys = await listFiles();
    fixKeys();
    watchFileCreation(updateCachedKeys);
    watchFileDeletion(deleteCachedKeys);
  }
  return cachedKeys;
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
