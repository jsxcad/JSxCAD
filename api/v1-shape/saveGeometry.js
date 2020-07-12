import { read, write } from '@jsxcad/sys';

import Shape from './Shape.js';

export const loadGeometry = async (path) =>
  Shape.fromGeometry(await read(path));

export const saveGeometry = async (path, shape) =>
  write(path, shape.toGeometry());
