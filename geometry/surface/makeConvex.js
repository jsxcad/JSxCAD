import { makeConvex as makeConvexZ0Polygons, union } from '@jsxcad/geometry-z0surface';
import { toPlane, transform } from './main';

import { assertCoplanar } from './assertCoplanar';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

export const makeConvex = (options = {}, surface) => {
  assertCoplanar(surface);
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  let retessellatedSurface = makeConvexZ0Polygons({}, union(...transform(to, surface).map(polygon => [polygon])));
  return transform(from, retessellatedSurface);
};
