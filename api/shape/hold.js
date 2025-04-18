import { Shape } from './Shape.js';
import { hold as op } from '@jsxcad/geometry';

export const hold = Shape.registerMethod3(
  'hold',
  ['inputGeometry', 'geometries'],
  op
);
