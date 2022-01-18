import {
  ErrorWouldBlock,
  read as readPath,
  readNonblocking as readPathNonblocking,
} from '@jsxcad/sys';

import { load, loadNonblocking } from './load.js';

export const read = async (path, options) => {
  const readData = await readPath(path, options);
  if (!readData) {
    return;
  }
  return load(readData);
};

export const readNonblocking = (path, options) => {
  const readData = readPathNonblocking(path, options);
  if (!readData) {
    return;
  }
  try {
    return loadNonblocking(readData);
  } catch (error) {
    if (error instanceof ErrorWouldBlock) {
      if (options && options.errorOnMissing === false) {
        return;
      }
    }
    throw error;
  }
};
