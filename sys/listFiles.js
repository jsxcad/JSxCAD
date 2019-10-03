import { getBase } from './filesystem';
import localForage from 'localforage';

let cachedKeys;

const getKeys = async () => {
  // FIX: Install a watcher to keep the cache up-to-date.
  if (cachedKeys === undefined) {
    cachedKeys = await localForage.keys();
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
