import { retessellate as retessellateZ0Surface } from '@jsxcad/geometry-z0surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

export const retessellate = (surface) => {
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surface));
  const z0Surface = transform(toZ0, surface);
  const retessellated = retessellateZ0Surface(z0Surface);
  return transform(fromZ0, retessellated);
};
