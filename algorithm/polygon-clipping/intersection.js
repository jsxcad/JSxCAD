import { clean, fromSurface, toSurface } from './convert';

import { createNormalize2 } from './createNormalize2';
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
  const clippings = z0Surfaces.map(surface => fromSurface(normalize2, surface));
  const clipping = intersectionClipping(normalize2, clippings);
  const surface = toSurface(normalize2, clipping);
  return surface;
};

export const intersectionClipping = (normalize2, clippings) => {
  while (clippings.length >= 2) {
    const a = clippings.shift();
    const b = clippings.shift();
    const result = polygonClipping.intersection(a, b);
    const cleaned = clean(normalize2, result);
    if (cleaned.length === 0) {
      return [];
    }
    clippings.push(cleaned);
  }
  return clippings[0];
};
