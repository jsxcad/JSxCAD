import { clippingToPolygons } from './clippingToPolygons';
import { difference as polygonClippingDifference } from 'polygon-clipping';

/**
 * Return a surface representing the difference between the first surface
 *   and the rest of the surfaces.
 * The difference of no surfaces is the empty surface.
 * The difference of one surface is that surface.
 * @param {Array<surface>} surfaces - the surfaces.
 * @returns {surface} - the resulting surface
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
export const difference = (...z0Surfaces) => {
  if (z0Surfaces.length === 0) {
    return [];
  }
  const clipping = z0Surfaces.map(z0Surface => z0Surface.map(z0Polygon => z0Polygon.map(([x = 0, y = 0]) => [x, y])));
  return clippingToPolygons(polygonClippingDifference(...clipping));
};
