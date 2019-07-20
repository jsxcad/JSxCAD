import { fromSurface, toSurface } from './convert';

import polybooljs from 'polybooljs';

/**
 * Produces a surface that is the union of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const union = (...surfaces) => {
  if (surfaces.length === 0) {
    return [];
  }
  while (surfaces.length >= 2) {
    const a = surfaces.shift();
    const b = surfaces.shift();
    const result = polybooljs.union(fromSurface(a), fromSurface(b));
    surfaces.push(toSurface(result));
  }
  return surfaces[0];
};
