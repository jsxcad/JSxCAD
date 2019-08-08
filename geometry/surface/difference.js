import { difference as differenceZ0Surfaces } from '@jsxcad/algorithm-polygon-clipping';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const difference = (...surfaces) => {
  if (surfaces.length === 0) {
    return [];
  }
  if (surfaces[0].length === 0) {
    return [];
  }
  surfaces = surfaces.filter(surface => surface.length >= 1);
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surfaces[0]));
  const z0Surface = differenceZ0Surfaces(...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};
