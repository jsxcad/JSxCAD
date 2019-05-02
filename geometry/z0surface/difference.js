import { clippingToPolygons, z0SurfaceToClipping } from './clippingToPolygons';

import { canonicalize } from '@jsxcad/geometry-paths';
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
export const difference = (baseSurface, ...surfaces) => {
  if (surfaces.length === 0) {
    return baseSurface;
  }
  const surfaceClipping = z0SurfaceToClipping(canonicalize(baseSurface));
  const subtractionClipping = surfaces.map(surface => z0SurfaceToClipping(canonicalize(surface)));
  const outputClipping = polygonClippingDifference(surfaceClipping, ...subtractionClipping);
  const outputPaths = clippingToPolygons(outputClipping);
  return outputPaths;
};
