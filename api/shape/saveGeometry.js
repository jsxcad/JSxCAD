import { write, writeNonblocking } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const saveGeometry = async (path, shape) =>
  Shape.fromGeometry(await write(path, shape.toGeometry()));

export const saveGeometryNonblocking = (path, shape) =>
  Shape.fromGeometry(writeNonblocking(path, shape.toGeometry()));
