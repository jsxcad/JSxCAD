import { makeConvex as makeConvexZ0Surface } from '@jsxcad/geometry-z0surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './ops';

export const makeConvex = (surface) => {
  if (surface.length === undefined) {
    throw Error('die');
  }
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  const plane = toPlane(surface);
  const [to, from] = toXYPlaneTransforms(plane);
  const convexZ0Surface = makeConvexZ0Surface(transform(to, surface));
  const convexSurface = transform(from, convexZ0Surface);
  // FIX: Is this plane enforecement necessary?
  // for (const path of convexSurface) {
  //   path.plane = plane;
  // }
  return convexSurface;
};
