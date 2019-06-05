import { clippingToPolygons, notEmpty, z0SurfaceToClipping } from './clippingToPolygons';

import polygonClipping from 'polygon-clipping';

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
export const difference = (baseZ0Surface, ...z0Surfaces) => {
  if (z0Surfaces.length === 0) {
    return baseZ0Surface;
  }
  if (baseZ0Surface.length === 0) {
    return [];
  }
  const baseClipping = z0SurfaceToClipping(baseZ0Surface);
  const clipping = z0Surfaces.filter(notEmpty).map(z0Surface => z0SurfaceToClipping(z0Surface));
  if (notEmpty(clipping)) {
    const outputClipping = polygonClipping.difference(baseClipping, ...clipping);
    const outputPaths = clippingToPolygons(outputClipping);
    return outputPaths;
  } else {
    return baseZ0Surface;
  }
};
