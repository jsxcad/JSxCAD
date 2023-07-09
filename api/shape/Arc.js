import {
  Arc as ArcOp,
  ArcX as ArcXOp,
  ArcY as ArcYOp,
  ArcZ as ArcZOp,
} from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Arc = Shape.registerMethod3(
  'Arc',
  ['intervals', 'options'],
  ArcOp
);
export const ArcX = Shape.registerMethod3(
  'ArcX',
  ['intervals', 'options'],
  ArcXOp
);
export const ArcY = Shape.registerMethod3(
  'ArcY',
  ['intervals', 'options'],
  ArcYOp
);
export const ArcZ = Shape.registerMethod3(
  'ArcZ',
  ['intervals', 'options'],
  ArcZOp
);

export default Arc;
