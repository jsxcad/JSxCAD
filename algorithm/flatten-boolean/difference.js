import { fromSurface, toSurface } from './convert';

import { doesNotOverlap } from './doesNotOverlap';
import { subtract } from '@flatten-js/boolean-op';

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
  for (const surface of z0Surfaces) {
    if (doesNotOverlap(surface, baseZ0Surface)) {
      continue;
    }
    const result = subtract(fromSurface(baseZ0Surface), fromSurface(surface));
    baseZ0Surface = toSurface(result);
  }
  return baseZ0Surface;
};
