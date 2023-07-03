import Shape from './Shape.js';
import { to as op } from '@jsxcad/geometry';

export const to = Shape.registerMethod3(
  'to',
  ['inputGeometry', 'geometries'],
  op
);
