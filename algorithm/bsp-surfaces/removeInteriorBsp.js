import { BRANCH, IN_LEAF, OUT_LEAF } from './bsp';

import { removeInteriorPolygons } from './removeInteriorPolygons';

// Produce a version of b with all parts in a removed.
export const removeInteriorBsp = (a, b, removeSurfacePolygons = false) => {
  throw Error('deprecated');
  switch (b.kind) {
    case BRANCH: {
      const clipped = {
        back: removeInteriorBsp(a, b.back, removeSurfacePolygons),
        front: removeInteriorBsp(a, b.front, removeSurfacePolygons),
        plane: b.plane,
        kind: BRANCH,
        same: removeInteriorPolygons(a, b.same, removeSurfacePolygons)
      };
      return clipped;
    }
    case IN_LEAF:
    case OUT_LEAF:
      return b;
    default:
      throw Error(`die: ${b.kind}`);
  }
};
