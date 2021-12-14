import * as keyval from 'idb-keyval';
import { fromStringToIntegerHash } from './hash.js';
import localForage from 'localforage';

let localForageDbInstance;

export const localForageDb = () => {
  if (localForageDbInstance === undefined) {
    localForageDbInstance = localForage.createInstance({
      name: 'jsxcad',
      driver: localForage.INDEXEDDB,
      storeName: 'jsxcad',
      description: 'jsxcad local filesystem',
    });
  }
  return localForageDbInstance;
};

let idbKeyvalDbInstance = {};

export const idbKeyvalDb = (key) => {
  const [jsxcad, workspace, partition] = key.split('/');
  let index;

  switch (partition) {
    case 'config':
    case 'control':
    case 'source':
      index = `${jsxcad}_${workspace}_${partition}`;
      break;
    default:
      index = `${jsxcad}_${workspace}_cache_${
        fromStringToIntegerHash(key) % 10
      }`;
      break;
  }
  if (idbKeyvalDbInstance[index] === undefined) {
    const store = keyval.createStore(index, `jsxcad`);
    idbKeyvalDbInstance[index] = {
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
  }
  return idbKeyvalDbInstance[index];
};

// export const db = localForageDb;
export const db = idbKeyvalDb;
