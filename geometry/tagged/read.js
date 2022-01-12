import { load, loadNonblocking } from './load.js';

import {
  read as readPath,
  readNonblocking as readPathNonblocking,
} from '@jsxcad/sys';

export const read = async (path) => {
  const readData = await readPath(path);
  if (!readData) {
    return;
  }
  return load(readData);
};

export const readNonblocking = (path) => {
  const readData = readPathNonblocking(path);
  if (!readData) {
    return;
  }
  return loadNonblocking(readPathNonblocking(path));
};
