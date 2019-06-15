import { clippingToPolygons, notEmpty, z0SurfaceToClipping } from './clippingToPolygons';
import { Polygon, point as createPoint } from "@flatten-js/core"

import { unify } from "@flatten-js/boolean-op"

/**
 * Produces a surface that is the union of all provided surfaces.
 * The union of no surfaces is the empty surface.
 * The union of one surface is that surface.
 * @param {Array<Z0Surface>} surfaces - the z0 surfaces to union.
 * @returns {Z0Surface} the resulting z0 surface.
 */
export const union = (z0Surface, ...z0Surfaces) => {
  if (z0Surface === undefined || z0Surface.length === 0) {
    return [];
  }
  if (z0Surfaces.length === 0) {
    return z0Surface;
  }
  const a = new Polygon();
  for (const polygon of z0Surface) {
    a.addFace(polygon.map(([x, y]) => createPoint(x, y)));
  }
  const b = new Polygon();
  for (const surface of z0Surfaces) {
    for (const polygon of surface) {
      b.addFace(polygon.map(([x, y]) => createPoint(x, y)));
    }
  }
  const c = unify(a, b);
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
