import { clippingToPolygons, notEmpty, z0SurfaceToClipping } from './clippingToPolygons';

import polygonClipping from 'polygon-clipping';

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
  if (surfaces.length === 1) {
    return surfaces[0];
  }
  const clipping = surfaces.filter(notEmpty).map(surface => z0SurfaceToClipping(surface));
  if (notEmpty(clipping)) {
    const result = polygonClipping.union(...clipping);
    return clippingToPolygons(result);
  } else {
    return [];
  }
};
