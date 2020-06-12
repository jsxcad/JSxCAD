import { fromSurface, toSurface } from "./convert";

import { doesNotOverlapOrAbut } from "./doesNotOverlap";
import polygonClipping from "./polygon-clipping.esm.js";

/**
 * Produces a surface that is the union of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const union = (...z0Surfaces) => {
  if (z0Surfaces.length === 0) {
    return [];
  }
  if (z0Surfaces.length === 1) {
    return z0Surfaces[0];
  }
  while (z0Surfaces.length >= 2) {
    const a = z0Surfaces.shift();
    const b = z0Surfaces.shift();
    if (doesNotOverlapOrAbut(a, b)) {
      z0Surfaces.push([].concat(a, b));
    } else {
      z0Surfaces.push(
        toSurface(polygonClipping.union(fromSurface(a), fromSurface(b)))
      );
    }
  }
  return z0Surfaces[0];
};
