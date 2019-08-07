import { fromSurface, toSurface } from './convert';

import { createNormalize2 } from './createNormalize2';
import { doesNotOverlap } from './doesNotOverlap';
import polygonClipping from 'polygon-clipping';

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
export const intersection = (...z0Surfaces) => {
  if (z0Surfaces.length === 0) {
    return [];
  }
  if (z0Surfaces.length === 1) {
    return z0Surfaces[0];
  }
  const normalize2 = createNormalize2();
  const input = z0Surfaces.map(surface => fromSurface(normalize2, surface));
  const result = polygonClipping.intersection(...input);
  return toSurface(result);
};
