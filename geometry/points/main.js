import { transform, translate } from './ops.js';

import { canonicalize } from './canonicalize.js';
import { eachPoint } from './eachPoint.js';
import { fromPolygons } from './fromPolygons.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { union } from './union.js';

const flip = (points) => points;

export {
  canonicalize,
  eachPoint,
  flip,
  fromPolygons,
  measureBoundingBox,
  transform,
  translate,
  union,
};
