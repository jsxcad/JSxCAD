import { fromSurface, toSurface } from "./convert";

import { doesNotOverlap } from "./doesNotOverlap";
import polybooljs from "./polybooljs/index";

/**
 * Return a surface representing the difference between the first surface
 *   and the rest of the surfaces.
 * The difference of no surfaces is the empty surface.
 * The difference of one surface is that surface.
 * @param {Array<surface>} surfaces - the surfaces.
 * @returns {surface} - the resulting surface
 * @example
 * let C = difference(A, B)
 * @example
 * +-------+            +-------+
 * |       |            |   C   |
 * |   A   |            |       |
 * |    +--+----+   =   |    +--+
 * +----+--+    |       +----+
 *      |   B   |
 *      |       |
 *      +-------+
 */
export const difference = (baseZ0Surface, ...z0Surfaces) => {
  if (baseZ0Surface === undefined || baseZ0Surface.length === 0) {
    return [];
  }
  for (const z0Surface of z0Surfaces) {
    if (doesNotOverlap(z0Surface, baseZ0Surface)) {
      continue;
    }
    const result = polybooljs.difference(
      fromSurface(baseZ0Surface),
      fromSurface(z0Surface)
    );
    baseZ0Surface = toSurface(result);
  }
  return baseZ0Surface;
};
