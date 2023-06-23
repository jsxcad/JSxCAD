import Shape from './Shape.js';
import { Cut as CutOp, cut as cutOp } from '@jsxcad/geometry';

export const Cut = Shape.registerMethod3(
  'Cut',
  ['geometries', 'modes:open,exact,noVoid,noGhost'],
  CutOp,
);

export const cut = Shape.registerMethod3(
  'cut',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  cutOp,
);
