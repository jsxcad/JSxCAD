import { clippingToPolygons, notEmpty, z0SurfaceToClipping } from './clippingToPolygons';
import { Polygon, point as createPoint } from "@flatten-js/core"

import { subtract } from "@flatten-js/boolean-op"

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
  if (baseZ0Surface === undefined || baseZ0Surface.length === 0) {
    return [];
  }
  if (z0Surfaces.length === 0) {
    return baseZ0Surface;
  }
  const a = new Polygon();
  for (const polygon of baseZ0Surface) {
    a.addFace(polygon.map(([x, y]) => createPoint(x, y)));
  }
  const b = new Polygon();
  for (const surface of z0Surfaces) {
    for (const polygon of surface) {
      b.addFace(polygon.map(([x, y]) => createPoint(x, y)));
    }
  }
  const c = subtract(a, b);
  const result = [];
  for (const face of c.faces) {
    const polygon = [];
    for (const edge of face) {
      const start = edge.start;
      polygon.push([start.x, start.y, 0]);
    }
    result.push(polygon);
  }
  return result;
};
