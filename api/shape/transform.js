import Shape from './Shape.js';
import { transform as transformGeometry } from '@jsxcad/geometry';

export const transform = Shape.registerMethod(
  'transform',
  (matrix) => async (shape) =>
    Shape.fromGeometry(transformGeometry(matrix, await shape.toGeometry()))
);
