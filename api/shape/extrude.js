import {
  extrudeAlongX as xOp,
  extrudeAlongY as yOp,
  extrudeAlongZ as zOp,
} from '@jsxcad/geometry';

import Shape from './Shape.js';

export const extrudeX = Shape.registerMethod3(
  ['extrudeX', 'ex'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  xOp
);

export const ex = extrudeX;

export const extrudeY = Shape.registerMethod3(
  ['extrudeY', 'ey'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  yOp
);

export const ey = extrudeY;

export const extrudeZ = Shape.registerMethod3(
  ['extrudeZ', 'ez'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  zOp
);

export const ez = extrudeZ;
