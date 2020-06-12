import { transform, translate } from "./ops";

import { canonicalize } from "./canonicalize";
import { eachPoint } from "./eachPoint";
import { fromPolygons } from "./fromPolygons";
import { measureBoundingBox } from "./measureBoundingBox";
import { union } from "./union";

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
