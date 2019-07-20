import { fromSurface, toSurface } from './convert';

import { doesNotOverlap } from './doesNotOverlap';
import polybooljs from 'polybooljs';

/**
 * Produce a surface that is the intersection of all provided surfaces.
 * The intersection of no surfaces is the empty surface.
 * The intersection of one surface is that surface.
 * @param {Array<surface>} surfaces - the surfaces to intersect.
 * @returns {surface} the intersection of surfaces.
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
export const intersection = (baseZ0Surface, ...z0Surfaces) => {
  if (baseZ0Surface === undefined || baseZ0Surface.length === 0) {
    return [];
  }
  if (z0Surfaces.length === 0) {
    return baseZ0Surface;
  }
  for (const surface of z0Surfaces) {
    if (doesNotOverlap(surface, baseZ0Surface)) {
      return [];
    }
    const result = polybooljs.intersect(fromSurface(baseZ0Surface), fromSurface(surface));
    baseZ0Surface = toSurface(result);
  }
  return baseZ0Surface;
};
