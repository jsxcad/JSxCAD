import { toPlane, transform } from './ops';

import { assertCoplanar } from './assertCoplanar';
import { assertGood } from './assertGood';
import { makeConvex as makeConvexZ0Surface } from '@jsxcad/geometry-z0surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

export const makeConvex = (options = {}, surface) => {
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  assertCoplanar(surface);
  assertGood(surface);
  const plane = toPlane(surface);
  const [to, from] = toXYPlaneTransforms(plane);
  const retessellatedZ0Surface = makeConvexZ0Surface({}, transform(to, surface));
  const retessellatedSurface = transform(from, retessellatedZ0Surface);
  // FIX: Is this plane enforecement necessary.
  for (const retessellatedPolygon of retessellatedSurface) {
    retessellatedPolygon.plane = plane;
  }
  return retessellatedSurface;
};
