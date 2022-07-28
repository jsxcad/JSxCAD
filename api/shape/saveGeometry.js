import { write, writeNonblocking } from '@jsxcad/geometry';

import { ErrorWouldBlock } from '@jsxcad/sys';
import Shape from './Shape.js';

export const saveGeometry = async (path, shape) =>
  Shape.fromGeometry(await write(path, shape.toGeometry()));

export const saveGeometryNonblocking = (path, shape) => {
  Shape.fromGeometry(writeNonblocking(path, shape.toGeometry()));
  throw new ErrorWouldBlock('Save Geometry');
};
