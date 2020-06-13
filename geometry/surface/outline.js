import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { outline as outlineZ0Surface } from '@jsxcad/geometry-z0surface-boolean';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const outline = (
  surface,
  normalize = createNormalize3(),
  plane = toPlane(surface)
) => {
  if (plane === undefined) {
    return [];
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Surface = transform(
    toZ0,
    surface.map((path) => path.map(normalize))
  );
  const outlinedZ0Surface = outlineZ0Surface(z0Surface, normalize);
  return transform(fromZ0, outlinedZ0Surface).map((path) =>
    path.map(normalize)
  );
};
