import { fromStringToIntegerHash } from './hash.js';
import { openDB } from 'idb';

const cacheStoreCount = 10;
const workspaces = {};

const ensureDb = (workspace) => {
  let entry = workspaces[workspace];
  if (!entry) {
    const db = openDB('jsxcad/idb', 1, {
      upgrade(db) {
        db.createObjectStore('config/value');
        db.createObjectStore('config/version');
        db.createObjectStore('control/value');
        db.createObjectStore('control/version');
        db.createObjectStore('source/value');
        db.createObjectStore('source/version');
        for (let nth = 0; nth < cacheStoreCount; nth++) {
          db.createObjectStore(`cache_${nth}/value`);
          db.createObjectStore(`cache_${nth}/version`);
        }
      },
    });
    entry = { db, instances: [] };
    workspaces[workspace] = entry;
  }
  return entry;
};

const ensureStore = (store, db, instances) => {
  let instance = instances[store];
  const valueStore = `${store}/value`;
  const versionStore = `${store}/version`;
  if (!instance) {
    instance = {
      clear: async () => {
        const tx = (await db).transaction(
          [valueStore, versionStore],
          'readwrite'
        );
        await tx.objectStore(valueStore).clear();
        await tx.objectStore(versionStore).clear();
        await tx.done;
        return true;
      },
      getItem: async (key) => (await db).get(valueStore, key),
      getItemAndVersion: async (key) => {
        const tx = (await db).transaction([valueStore, versionStore]);
        const value = await tx.objectStore(valueStore).get(key);
        const version = await tx.objectStore(versionStore).get(key);
        await tx.done;
        return { value, version };
      },
      getItemVersion: async (key) => (await db).get(versionStore, key),
      keys: async () => (await db).getAllKeys(valueStore),
      removeItem: async (key) => (await db).delete(valueStore, key),
      setItem: async (key, value) => (await db).put(valueStore, value, key),
      setItemAndIncrementVersion: async (key, value) => {
        const tx = (await db).transaction(
          [valueStore, versionStore],
          'readwrite'
        );
        const version = (await tx.objectStore(versionStore).get(key)) || 0;
        await tx.objectStore(versionStore).put(version + 1, key);
        await tx.objectStore(valueStore).put(value, key);
        await tx.done;
        return version;
      },
    };
    instances[store] = instance;
  }
  return instance;
};

export const db = (key) => {
  const [jsxcad, workspace, partition] = key.split('/');
  let store;

  if (jsxcad !== 'jsxcad') {
    throw Error('Malformed key');
  }

  switch (partition) {
    case 'config':
    case 'control':
    case 'source':
      store = partition;
      break;
    default: {
      const nth = fromStringToIntegerHash(key) % cacheStoreCount;
      store = `cache_${nth}`;
      break;
    }
  }
  const { db, instances } = ensureDb(workspace);
  return ensureStore(store, db, instances);
};

export const clearCacheDb = async ({ workspace }) => {
  const { db, instances } = ensureDb(workspace);
  for (let nth = 0; nth < cacheStoreCount; nth++) {
    await ensureStore(`cache_${nth}`, db, instances).clear();
  }
};
