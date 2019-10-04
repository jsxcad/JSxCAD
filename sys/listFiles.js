import { getBase } from './filesystem';
import localForage from 'localforage';
import { watchFileCreation } from './files';

let cachedKeys;

const updateCachedKeys = (options = {}, file) => cachedKeys.add(file.storageKey);

const getKeys = async () => {
  if (cachedKeys === undefined) {
    cachedKeys = new Set(await localForage.keys());
    watchFileCreation(updateCachedKeys);
  }
  return cachedKeys;
}

export const listFilesystems = async () => {
  const keys = await getKeys();
  const filesystems = new Set();
  for (const key of keys) {
    if (key.startsWith('file/')) {
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
  const filesystem = `file/${base}`;
  const keys = await getKeys();
  const files = [];
  for (const key of keys) {
    if (key.startsWith(filesystem)) {
      files.push(key.substring(filesystem.length));
    }
  }
  return files;
};
