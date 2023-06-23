import Shape from './Shape.js';
import { cutFrom as op } from '@jsxcad/geometry';

export const cutFrom = Shape.registerMethod3(
  'cutFrom',
  ['inputGeometry', 'geometry', 'modes:open,exact,noVoid,noGhost'],
  op
);
