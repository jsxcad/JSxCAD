import * as keyval from 'idb-keyval';
import { fromStringToIntegerHash } from './hash.js';

const cacheStoreCount = 10;
const idbKeyvalDbInstance = {};

const ensureDb = (index) => {
  let instance = idbKeyvalDbInstance[index];
  if (instance) {
    return instance;
  }
  const store = keyval.createStore(index, `jsxcad`);
  instance = {
    clear() {
      return keyval.clear(store);
    },
    removeItem(path) {
      return keyval.del(path, store);
    },
    getItem(path) {
      return keyval.get(path, store);
    },
    keys() {
      return keyval.keys(store);
    },
    setItem(path, value) {
      return keyval.set(path, value, store);
    },
  };
  idbKeyvalDbInstance[index] = instance;
  return instance;
};

export const db = (key) => {
  const [jsxcad, workspace, partition] = key.split('/');
  let index;

  if (jsxcad !== 'jsxcad') {
    throw Error('Malformed key');
  }

  switch (partition) {
    case 'config':
    case 'control':
    case 'source':
      index = `jsxcad_${workspace}_${partition}`;
      break;
    default: {
      const nth = fromStringToIntegerHash(key) % cacheStoreCount;
      index = `jsxcad_${workspace}_cache_${nth}`;
      break;
    }
  }
  return ensureDb(index);
};

export const clearCacheDb = async ({ workspace }) => {
  for (let nth = 0; nth < cacheStoreCount; nth++) {
    await ensureDb(`jsxcad_${workspace}_cache_${nth}`).clear();
  }
};
