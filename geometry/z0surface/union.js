import { fromSurface, toSurface } from './convert';

import { createNormalize2 } from './createNormalize2';
import { doesNotOverlap } from './doesNotOverlap';
// import polygonClipping from 'polygon-clipping';
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
  const normalize2 = createNormalize2();
  const input = z0Surfaces.map(surface => fromSurface(normalize2, surface));
  let result;
  try {
    result = polygonClipping.union(...input);
  } catch (e) {
    console.log(`QQ/z0Surface/union/input: ${JSON.stringify(input)}`);
    throw e;
  }
  return toSurface(result);
};
