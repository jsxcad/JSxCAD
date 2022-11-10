import Shape from './Shape.js';
import { transform as transformGeometry } from '@jsxcad/geometry';

export const transform = Shape.registerMethod(
  'transform',
  (matrix) => (shape) =>
    Shape.fromGeometry(transformGeometry(matrix, shape.toGeometry()))
);
