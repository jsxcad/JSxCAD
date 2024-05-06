import Shape from './Shape.js';
import { grow as op } from '@jsxcad/geometry';

export const grow = Shape.registerMethod3(
  'grow',
  ['inputGeometry', 'geometry'],
  op
);
