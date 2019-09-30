import { equals } from './equals';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';
import { union as unionZ0Surfaces } from '@jsxcad/geometry-z0surface-boolean';

export const union = (baseSurface, ...surfaces) => {
  const basePlane = toPlane(baseSurface);
  surfaces = surfaces.filter(surface => surface.length >= 1 &&
                             (equals(toPlane(baseSurface), toPlane(surface))));
  if (surfaces.length === 0) {
    return baseSurface;
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(basePlane);
  const z0Surface = unionZ0Surfaces(transform(toZ0, baseSurface),
                                    ...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};
