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
  const clippings = z0Surfaces.map(surface => fromSurface(surface));
  const clipping = intersectionClipping(clippings);
  const surface = toSurface(clipping);
  return surface;
};

export const intersectionClipping = (clippings) => {
  while (clippings.length >= 2) {
    const a = clippings.shift();
    const b = clippings.shift();
    const result = polygonClipping.intersection(a, b);
    if (result.length === 0) {
      return [];
    }
    clippings.push(result);
  }
  return clippings[0];
};
