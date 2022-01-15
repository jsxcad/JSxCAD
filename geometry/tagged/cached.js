import { computeHash, readNonblocking, writeNonblocking } from '@jsxcad/sys';

export const cached =
  (computeKey, op) =>
  (...args) => {
    const key = computeKey(...args);
    const hash = computeHash(key);
    const path = `op/${hash}`;
    console.log(
      `QQ/Reading cached result for op ${JSON.stringify(key)} from ${path}`
    );
    const data = readNonblocking(path);
    if (data !== undefined) {
      console.log(`QQ/Using cached result for op ${JSON.stringify(key)}`);
      return data;
    }
    console.log(`QQ/Computing cached result for op ${JSON.stringify(key)}`);
    const result = op(...args);
    console.log(`QQ/Writing cached result for op ${JSON.stringify(key)}`);
    writeNonblocking(path, result);
    return result;
  };
