import * as keyval from 'idb-keyval/dist/cjs-compat';
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

let idbKeyvalDbInstance;

export const idbKeyvalDb = () => {
  if (idbKeyvalDbInstance === undefined) {
    const store = keyval.createStore('jsxcad', 'jsxcad');
    idbKeyvalDbInstance = {
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
  return idbKeyvalDbInstance;
};

// export const db = localForageDb;
export const db = idbKeyvalDb;
