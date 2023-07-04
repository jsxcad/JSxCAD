import Shape from './Shape.js';
import { bend as op } from '@jsxcad/geometry';

export const bend = Shape.registerMethod3(
  'bend',
  ['inputGeometry', 'number'],
  op
);
