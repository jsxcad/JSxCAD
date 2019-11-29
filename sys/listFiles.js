import * as fs from 'fs';

import { isBrowser, isNode } from './browserOrNode';
import { watchFileCreation, watchFileDeletion } from './files';

import { getBase } from './filesystem';
import localForage from 'localforage';

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
      return qualifiedPaths;
    };
  } else if (isBrowser) {
    return async () => {
      console.log(`QQ/scan/start`);
      // FIX: Remove 'file' -> 'source' migration.
      const keys = new Set(await localForage.keys());
      for (const key of keys) {
        const [domain, project, partition, ...pieces] = key.split('/');
        console.log(`QQ/considering: ${key}`);
        if (partition === 'file') {
          const newKey = `${domain}/${project}/source/${pieces.join('/')}`;
          console.log(`QQ/Considering: ${key}`);
          if (keys.has(newKey)) {
            console.log(`QQ/remove: ${key}`);
            await localForage.removeItem(key);
          } else {
            console.log(`QQ/fix: ${key} -> ${newKey}`);
            await localForage.setItem(newKey, await localForage.getItem(key));
          }
        }
      }
      console.log(`QQ/scan/end`);
      const qualifiedPaths = new Set(await localForage.keys());
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

export const listFiles = async (base) => {
  if (base === undefined) {
    base = getBase();
  }
  if (base === undefined) {
    return [];
  }
  const filesystem = `jsxcad/${base}`;
  const keys = await getKeys();
  const files = [];
  for (const key of keys) {
    if (key.startsWith(filesystem)) {
      files.push(key.substring(filesystem.length));
    }
  }
  return files;
};
