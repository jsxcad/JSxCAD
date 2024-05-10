import Shape from './Shape.js';
import { grow as op } from '@jsxcad/geometry';

export const Grow = Shape.registerMethod3('Grow', ['geometry', 'geometry'], op);

export const grow = Shape.registerMethod3(
  'grow',
  ['inputGeometry', 'geometry'],
  op
);
