import { intersection as intersectionZ0Surfaces } from '@jsxcad/geometry-z0surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const intersection = (...surfaces) => {
  if (surfaces.length === 0) {
    return [];
  }
  for (const surface of surfaces) {
    if (surface.length === 0) {
      return [];
    }
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surfaces[0]));
  const z0Surface = intersectionZ0Surfaces(...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};
