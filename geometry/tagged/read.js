import {
  read as readPath,
  readNonblocking as readPathNonblocking,
} from '@jsxcad/sys';

export const read = async (path) => readPath(path);

export const readNonblocking = (path) => readPathNonblocking(path);
