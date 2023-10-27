import Shape from './Shape.js';
import { to as op } from '@jsxcad/geometry';

export const To = Shape.registerMethod3(
  'To',
  ['geometry', 'geometry', 'geometry'],
  op
);

export const to = Shape.registerMethod3(
  'to',
  ['inputGeometry', 'geometry', 'geometry'],
  op
);
