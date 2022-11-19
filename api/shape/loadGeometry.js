import { read, readNonblocking } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { logInfo } from '@jsxcad/sys';

const fromUndefined = () => undefined;

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

export const loadGeometryNonblocking = (path, options) => {
  logInfo('api/shape/loadGeometryNonblocking', path);
  const geometry = readNonblocking(path, options);
  if (geometry) {
    return Shape.fromGeometry(geometry);
  }
};
