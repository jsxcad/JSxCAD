import { BRANCH, IN_LEAF, OUT_LEAF } from './bsp';

import { removeExteriorPolygons } from './removeExteriorPolygons';

// Produce a version of b with all parts outside a removed.
export const removeExteriorBsp = (a, b, removeSurfacePolygons = false) => {
  throw Error('deprecated');
  switch (b.kind) {
    case BRANCH: {
      const clipped = {
        back: removeExteriorBsp(a, b.back, removeSurfacePolygons),
        front: removeExteriorBsp(a, b.front, removeSurfacePolygons),
        plane: b.plane,
        kind: BRANCH,
        same: removeExteriorPolygons(a, b.same, removeSurfacePolygons)
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
