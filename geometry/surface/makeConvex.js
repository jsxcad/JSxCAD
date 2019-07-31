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
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  let retessellatedSurface = makeConvexZ0Surface({}, transform(to, surface));
  return transform(from, retessellatedSurface);
};
