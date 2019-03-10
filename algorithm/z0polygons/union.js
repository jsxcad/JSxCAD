import { clippingToPolygons } from './clippingToPolygons';
import { union as polygonClippingUnion } from 'polygon-clipping';

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
  const clipping = z0Surfaces.map(z0Surface => z0Surface.map(z0Polygon => z0Polygon.map(([x = 0, y = 0]) => [x, y])));
  return clippingToPolygons(polygonClippingUnion(...clipping));
};
