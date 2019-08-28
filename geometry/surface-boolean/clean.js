import { clean as cleanZ0Surface } from '@jsxcad/geometry-z0surface-boolean';

import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const clean = (surface) => {
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surface));
  const z0Surface = transform(toZ0, surface);
  const cleanedZ0Surface = cleanZ0Surface(z0Surface);
  return transform(fromZ0, cleanedZ0Surface);
};
