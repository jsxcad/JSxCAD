import localForage from 'localforage';

let dbInstance;

export const db = () => {
  if (dbInstance === undefined) {
    dbInstance = localForage.createInstance({
      name: 'jsxcad',
      driver: localForage.INDEXEDDB,
      storeName: 'jsxcad',
      description: 'jsxcad local filesystem'
    });
  }
  return dbInstance;
};

let oldDbInstance;

export const oldDb = () => {
  if (oldDbInstance === undefined) {
    oldDbInstance = localForage.createInstance();
  }
  return oldDbInstance;
};
