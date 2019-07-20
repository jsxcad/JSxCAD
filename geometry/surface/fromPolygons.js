import { clean as cleanZ0Surface, union as unionZ0Surface, difference as differenceZ0Surface } from '@jsxcad/geometry-z0surface';
import { isClockwise } from '@jsxcad/geometry-path';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const fromPolygons = (polygons) => {
  if (polygons.length === 0) {
    throw Error('die');
  }
  // This might do it upside down.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(polygons));
  const z0Polygons = transform(toZ0, polygons);
  // FIX: Detect when the polygons aren't in the same plane.

  console.log(`QQ/surface/fromPolygons/polygons: ${JSON.stringify(polygons)}`);
  // This could be more efficient.
  const z0Surface = unionZ0Surface(...z0Polygons.map(polygon => [polygon]));
  console.log(`QQ/surface/fromPolygons/z0surface: ${JSON.stringify(z0Surface)}`);
  return transform(fromZ0, z0Surface);
};
