import { logInfo, readNonblocking } from '@jsxcad/sys';

import Shape from './Shape.js';

export const readShapeCache = (name, args) => {
  const key = `${name}/${JSON.stringify(args)}`;
  const value = readNonblocking(key);
  if (value) {
    logInfo('api/shape/readShapeCache', `read ${key}`);
    return Shape.fromGeometry(value);
  }
  logInfo('api/shape/readShapeCache', `missing ${key}`);
};
