import Shape from './Shape.js';
import { measureArea as op } from '@jsxcad/geometry';

export const area = Shape.registerMethod3(
  'area',
  ['inputGeometry', 'function'],
  op,
  (result, [geometry, op = (area) => (_shape) => area]) =>
    op(result)(Shape.fromGeometry(geometry))
);
