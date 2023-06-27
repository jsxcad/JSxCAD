import Shape from './Shape.js';
import { cut as cutOp } from '@jsxcad/geometry';

export const Cut = Shape.registerMethod3(
  'Cut',
  ['geometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  cutOp
);

export const cut = Shape.registerMethod3(
  'cut',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  cutOp
);
