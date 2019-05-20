import { makeConvex as makeConvexZ0Surface, union } from '@jsxcad/geometry-z0surface';
import { toPlane, transform } from './main';

import { assertCoplanar } from './assertCoplanar';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

export const makeConvex = (options = {}, surface) => {
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  assertCoplanar(surface);
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  // let retessellatedSurface = makeConvexZ0Surface({}, union(...transform(to, surface).map(polygon => [polygon])));
  let retessellatedSurface = makeConvexZ0Surface({}, transform(to, surface));
  return transform(from, retessellatedSurface);
};
