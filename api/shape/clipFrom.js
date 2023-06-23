import { Shape } from './Shape.js';
import { clipFrom as clipFromOp } from '@jsxcad/geometry';

export const clipFrom = Shape.registerMethod3(
  'clipFrom',
  ['inputGeometry', 'geometry', 'modes:open,exact,noVoid,noGhost,onlyGraph'],
  clipFromOp
);
