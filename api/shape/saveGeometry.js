import { write, writeNonblocking } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { logInfo } from '@jsxcad/sys';

export const saveGeometry = async (path, shape) => {
  logInfo('api/shape/saveGeometry', path);
  return Shape.fromGeometry(await write(path, shape.toGeometry()));
};

export const saveGeometryNonblocking = (path, shape) => {
  logInfo('api/shape/saveGeometryNonblocking', path);
  return Shape.fromGeometry(writeNonblocking(path, shape.toGeometry()));
};
