import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';
import { union as unionZ0Surfaces } from '@jsxcad/geometry-z0surface-boolean';

export const union = (...surfaces) => {
  surfaces = surfaces.filter(surface => surface.length >= 1);
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surfaces[0]));
  const z0Surface = unionZ0Surfaces(...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};
