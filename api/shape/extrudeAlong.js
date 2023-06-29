import {
  extrudeAlongNormal as extrudeAlongNormalOp,
  extrudeAlong as extrudeAlongOp,
} from '@jsxcad/geometry';

import Shape from './Shape.js';

// This interface is a bit awkward.
export const extrudeAlong = Shape.registerMethod3(
  'extrudeAlong',
  ['inputGeometry', 'coordinate', 'intervals', 'modes:noVoid'],
  extrudeAlongOp
);

// Note that the operator is applied to each leaf geometry by default.
export const e = Shape.registerMethod3(
  ['e', 'extrudeAlongNormal'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  extrudeAlongNormalOp
);

export default extrudeAlong;
