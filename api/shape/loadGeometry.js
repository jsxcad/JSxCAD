import { read, readNonblocking } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { logInfo } from '@jsxcad/sys';

const fromUndefined = () => Shape.fromGeometry();

export const loadGeometry = async (
  path,
  { otherwise = fromUndefined } = {}
) => {
  logInfo('api/shape/loadGeometry', path);
  const geometry = await read(path);
  if (geometry === undefined) {
    return otherwise();
  } else {
    return Shape.fromGeometry(geometry);
  }
};

export const loadGeometryNonblocking = (path) => {
  logInfo('api/shape/loadGeometryNonblocking', path);
  const geometry = readNonblocking(path);
  if (geometry) {
    return Shape.fromGeometry(geometry);
  }
};
