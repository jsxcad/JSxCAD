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
  z0Surfaces = z0Surfaces.filter(surface => !doesNotOverlap(baseZ0Surface, surface));
  if (baseZ0Surface === undefined || baseZ0Surface.length === 0) {
    return [];
  }
  if (z0Surfaces.length === 0) {
    return baseZ0Surface;
  }
  const result = polybooljs.intersect(fromSurface(baseZ0Surface), fromSurface(...z0Surfaces));
  return toSurface(result);
};
