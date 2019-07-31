import { fromSurface, toSurface } from './convert';

import { doesNotOverlap } from './doesNotOverlap';
import polybooljs from 'polybooljs';

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
  while (z0Surfaces.length >= 2) {
    const a = z0Surfaces.shift();
    const b = z0Surfaces.shift();
    if (doesNotOverlap(a, b)) {
      z0Surfaces.push([].concat(a, b));
    } else {
      const result = polybooljs.union(fromSurface(a), fromSurface(b));
      z0Surfaces.push(toSurface(result));
    }
  }
  return z0Surfaces[0];
};
