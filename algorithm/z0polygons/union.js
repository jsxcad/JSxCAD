import { canonicalize } from '@jsxcad/algorithm-paths';
import { clippingToPolygons, z0SurfaceToClipping } from './clippingToPolygons';
import { union as polygonClippingUnion } from 'polygon-clipping';

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
  if (surfaces.length == 1) {
    return surfaces[0];
  }
  const clipping = surfaces.map(surface => z0SurfaceToClipping(canonicalize(surface)));
  const result = polygonClippingUnion(...clipping);
  return clippingToPolygons(result);
};
