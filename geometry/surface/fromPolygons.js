import { clean as cleanZ0Surface, union as unionZ0Surface, difference as differenceZ0Surface } from '@jsxcad/geometry-z0surface';
import { isClockwise } from '@jsxcad/geometry-path';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const fromPolygons = ({ plane }, polygons) => {
  if (polygons.length === 0) {
    throw Error('die');
  }
  if (plane === undefined) {
    plane = toPlane(polygons);
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Polygons = transform(toZ0, polygons);
  const z0Surface = cleanZ0Surface(z0Polygons);
  const surface = transform(fromZ0, z0Surface);
  surface.plane = plane;
  return surface;
};
