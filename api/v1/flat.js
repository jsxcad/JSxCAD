import { measureBoundingBox, transform } from '@jsxcad/geometry-solid';

import { Shape } from './Shape';
import { fromTranslation } from '@jsxcad/math-mat4';
import { getSolids } from '@jsxcad/geometry-tagged';
import { toPlane } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

const Z = 2;

export const flat = (shape) => {
  const bestFlatSolids = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    let bestDepth = Infinity;
    let bestFlatSolid;
    for (const surface of solid) {
      const [to] = toXYPlaneTransforms(toPlane(surface));
      const flatSolid = transform(to, solid);
      const [min, max] = measureBoundingBox(flatSolid);
      const depth = max[Z] - min[Z];
      if (depth < bestDepth) {
        bestDepth = depth;
        bestFlatSolid = transform(fromTranslation([0, 0, -min[Z]]), flatSolid);
      }
    }
    if (bestFlatSolid) {
      bestFlatSolids.push({ solid: bestFlatSolid, tags });
    }
  }
  return Shape.fromGeometry({ assembly: bestFlatSolids });
};

const method = function () { return flat(this); };

Shape.prototype.flat = method;
