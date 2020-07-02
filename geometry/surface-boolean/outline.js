import { outline as outlineZ0Surface } from '@jsxcad/geometry-z0surface-boolean';

import { toPlane } from './toPlane.js';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform.js';

export const outline = (surface) => {
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surface));
  const z0Surface = transform(toZ0, surface);
  const outlinedZ0Surface = outlineZ0Surface(z0Surface);
  return transform(fromZ0, outlinedZ0Surface);
};
