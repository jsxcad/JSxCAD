import * as createHashModule from './create-hash.cjs';

const { createHash } = createHashModule;

export const hashObject = (object, hash) => {
  const keys = Object.keys(object);
  keys.sort();
  for (const key of keys) {
    if (typeof key === 'symbol') {
      continue;
    }
    hash.update(key);
    hashValue(object[key], hash);
  }
};

export const hashArray = (array, hash) => {
  for (const value of array) {
    hashValue(value, hash);
  }
};

export const hashValue = (value, hash) => {
  if (value === undefined) {
    hash.update('undefined');
  } else if (value === null) {
    hash.update('null');
  } else if (value instanceof Array) {
    hash.update('array');
    hashArray(value, hash);
  } else if (value instanceof Object) {
    hash.update('object');
    hashObject(value, hash);
  } else if (typeof value === 'number') {
    hash.update('number');
    hash.update(value.toString());
  } else if (typeof value === 'string') {
    hash.update('string');
    hash.update(value);
  } else if (typeof value === 'boolean') {
    hash.update('bool');
    hash.update(value ? 'true' : 'false');
  } else {
    throw Error(`Unexpected hashValue value ${value}`);
  }
};

export const computeHash = (value) => {
  const hash = createHash('sha256');
  hashValue(value, hash);
  return hash.digest('base64');
};

export const fromStringToIntegerHash = (s) =>
  Math.abs(
    s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  );
