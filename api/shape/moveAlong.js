import {
  moveAlongNormal as moveAlongNormalOp,
  moveAlong as moveAlongOp,
} from '@jsxcad/geometry';

import Shape from './Shape.js';

export const moveAlong = Shape.registerMethod3(
  'moveAlong',
  ['inputGeometry', 'coordinate', 'numbers'],
  moveAlongOp
);

export const m = Shape.registerMethod3(
  ['moveAlongNormal', 'm'],
  ['inputGeometry', 'numbers'],
  moveAlongNormalOp
);

export default moveAlong;
