import { toPlane, transform } from './main';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { makeConvex as makeConvexZ0Polygons, union } from '@jsxcad/algorithm-z0polygons';

export const makeConvex = (options = {}, surface) => {
console.log(`QQ/makeConvex/surface: ${JSON.stringify(surface)}`);
console.log(`QQ/makeConvex/surface/plane: ${JSON.stringify(toPlane(surface))}`);
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  console.log(`QQ/to-from: ${JSON.stringify([to, from])}`);
  let retessellatedSurface = makeConvexZ0Polygons({}, union(...transform(to, surface).map(polygon => [polygon])));
  return transform(from, retessellatedSurface);
};
