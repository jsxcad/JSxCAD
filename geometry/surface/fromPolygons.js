import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';
import { union as unionZ0Surface } from '@jsxcad/geometry-z0surface';

export const fromPolygons = ({ plane }, polygons) => {
  if (polygons.length === 0) {
    throw Error('die');
  }
  if (plane === undefined) {
    plane = toPlane(polygons);
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Polygons = transform(toZ0, polygons);
  const z0Surface = unionZ0Surface(...z0Polygons.map(polygon => [polygon]));
  const surface = transform(fromZ0, z0Surface);
  surface.plane = plane;
  return surface;
};
