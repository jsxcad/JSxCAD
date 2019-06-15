import { clippingToPolygons, notEmpty, z0SurfaceToClipping } from './clippingToPolygons';
import { Polygon, point as createPoint } from "@flatten-js/core"

import { intersect } from "@flatten-js/boolean-op"

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
export const intersection = (baseZ0Surface, ...z0Surfaces) => {
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
  const c = intersect(a, b);
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
