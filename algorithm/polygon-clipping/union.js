import { clean, fromSurface, toSurface } from './convert';

import { createNormalize2 } from './createNormalize2';
import polygonClipping from './polygon-clipping.esm.js';

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
  const clippings = z0Surfaces.map(surface => fromSurface(surface));
  const clipping = unionClipping(clippings);
  const surface = toSurface(clipping);
  return surface;
};

export const unionClipping = (clippings) => {
  while (clippings.length >= 2) {
    const a = clippings.shift();
    const b = clippings.shift();
    let result;
    try {
      result = polygonClipping.union(a, b);
    } catch (e) {
      console.log(e);
      throw e;
    }
    const cleaned = clean(result);
    clippings.push(cleaned);
  }
  return clippings[0];
};
