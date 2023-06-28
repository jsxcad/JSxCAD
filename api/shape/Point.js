import Shape from './Shape.js';
import { Point as op } from '@jsxcad/geometry';

export const Point = Shape.registerMethod3(
  'Point',
  ['number', 'number', 'number', 'coordinate'],
  op
);

export default Point;
