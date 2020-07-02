import { equals } from './equals.js';
import { intersection as intersectionZ0Surfaces } from '@jsxcad/geometry-z0surface-boolean';
import { toPlane } from './toPlane.js';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform.js';

export const intersection = (...surfaces) => {
  if (surfaces.length === 0) {
    return [];
  }
  for (const surface of surfaces) {
    if (
      surface.length === 0 ||
      !equals(toPlane(surfaces[0]), toPlane(surface))
    ) {
      return [];
    }
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surfaces[0]));
  const z0Surface = intersectionZ0Surfaces(
    ...surfaces.map((surface) => transform(toZ0, surface))
  );
  return transform(fromZ0, z0Surface);
};
