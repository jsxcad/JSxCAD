import { canonicalize } from './canonicalize';
import { clippingToPolygons } from './clippingToPolygons';
import { fromPolygons } from './fromPolygons';
import { intersection as polygonClippingIntersection } from 'polygon-clipping';

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
export const intersection = (...surfaces) => {
  switch (surfaces.length) {
    case 0:
      return fromPolygons({}, []);
    case 1:
      return surfaces[0];
    default: {
      const combined = surfaces.map(surface =>
        canonicalize(surface).polygons.map(polygon => polygon.map(([a, b]) => [a, b])));
      return fromPolygons(
        {},
        clippingToPolygons(polygonClippingIntersection(...combined)));
    }
  }
};
