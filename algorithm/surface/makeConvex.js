import { toPlane, transform } from './main';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { makeConvex as makeConvexZ0Polygons, union } from '@jsxcad/algorithm-z0surface';

export const makeConvex = (options = {}, surface) => {
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  let retessellatedSurface = makeConvexZ0Polygons({}, union(...transform(to, surface).map(polygon => [polygon])));
  return transform(from, retessellatedSurface);
};
