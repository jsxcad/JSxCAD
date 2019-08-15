import { assertGood } from './assertGood';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';
import { union as unionZ0Surface } from '@jsxcad/algorithm-polygon-clipping';

export const fromPolygons = ({ plane }, polygons) => {
  if (polygons.length === 0) {
    throw Error('die');
  }
  if (plane === undefined) {
    plane = toPlane(polygons);
  }
  assertGood(polygons);
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Polygons = transform(toZ0, polygons);
  assertGood(z0Polygons);
  const z0Surface = unionZ0Surface(...z0Polygons.map(polygon => [polygon]));
  assertGood(z0Surface);
  const surface = transform(fromZ0, z0Surface);
  assertGood(surface);
  surface.plane = plane;
  return surface;
};
