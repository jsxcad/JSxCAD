import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { retessellate as retessellateZ0Surface } from '@jsxcad/geometry-z0surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const retessellate = (
  surface,
  normalize3 = createNormalize3(),
  plane
) => {
  if (surface.length < 2) {
    return surface;
  }
  if (plane === undefined) {
    plane = toPlane(surface);
    if (plane === undefined) {
      return [];
    }
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(plane);
  const z0Surface = transform(
    toZ0,
    surface.map((path) => path.map(normalize3))
  );
  const retessellated = retessellateZ0Surface(z0Surface);
  return transform(fromZ0, retessellated).map((path) => path.map(normalize3));
};
