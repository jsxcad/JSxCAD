import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { isConvex } from '@jsxcad/math-poly3';
import { makeConvex as makeConvexZ0Surface } from '@jsxcad/geometry-z0surface';
import { makeWatertight } from './makeWatertight.js';
import { toPlane } from './toPlane.js';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './ops.js';

// Cut the corners to produce triangles.
const triangulateConvexPolygon = (polygon) => {
  const surface = [];
  for (let i = 2; i < polygon.length; i++) {
    surface.push([polygon[0], polygon[i - 1], polygon[i]]);
  }
  return surface;
};

export const makeConvex = (surface, normalize3 = createNormalize3(), plane) => {
  if (surface.length === undefined) {
    throw Error('die');
  }
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  if (surface.length === 1) {
    const polygon = surface[0];
    if (polygon.length === 3) {
      // A triangle is already convex.
      return surface;
    }
    if (polygon.length > 3 && isConvex(polygon)) {
      return triangulateConvexPolygon(polygon.map(normalize3));
    }
  }
  if (plane === undefined) {
    plane = toPlane(surface);
    if (plane === undefined) {
      return [];
    }
  }
  const [to, from] = toXYPlaneTransforms(plane);
  const z0Surface = transform(
    to,
    surface.map((path) => path.map(normalize3))
  );
  const convexZ0Surface = makeConvexZ0Surface(z0Surface);
  const convexSurface = transform(from, convexZ0Surface).map((path) =>
    path.map(normalize3)
  );
  return makeWatertight(convexSurface);
};
