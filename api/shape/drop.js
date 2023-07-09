import { Shape } from './Shape.js';
import { drop as op } from '@jsxcad/geometry';

export const drop = Shape.registerMethod3(
  'drop',
  ['inputGeometry', 'geometry'],
  op
);
