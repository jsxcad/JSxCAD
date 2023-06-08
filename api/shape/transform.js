import Shape from './Shape.js';
import { transform as transformGeometry } from '@jsxcad/geometry';

export const transform = Shape.registerMethod2(
  'transform',
  ['inputGeometry', 'value'],
  (geometry, matrix) => Shape.fromGeometry(transformGeometry(matrix, geometry))
);
