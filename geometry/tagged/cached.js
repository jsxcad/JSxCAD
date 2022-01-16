import { addPending, computeHash } from '@jsxcad/sys';

import { readNonblocking } from './read.js';
import { write } from './write.js';

export const cached =
  (computeKey, op) =>
  (...args) => {
    let key;
    try {
      key = computeKey(...args);
    } catch (error) {
      console.log(JSON.stringify([...args]));
      throw error;
    }
    const hash = computeHash(key);
    const path = `op/${hash}`;
    const data = readNonblocking(path, { errorOnMissing: false });
    if (data !== undefined) {
      console.log(`QQ/Using cached result for op ${JSON.stringify(key)}`);
      return data;
    }
    console.log(`QQ/Computing cached result for op ${JSON.stringify(key)}`);
    const result = op(...args);
    addPending(write(path, result));
    return result;
  };
