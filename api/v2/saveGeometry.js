import Shape from './Shape.js';
import { write } from '@jsxcad/geometry';

export const saveGeometry = async (path, shape) =>
  Shape.fromGeometry(await write(shape.toGeometry(), path));
