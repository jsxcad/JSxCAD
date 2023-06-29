import Shape from './Shape.js';
import { transform as op } from '@jsxcad/geometry';

export const transform = Shape.registerMethod3(
  'transform',
  ['inputGeometry', 'value'],
  op
);
