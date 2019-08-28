import { difference as differenceZ0Surfaces } from '@jsxcad/geometry-z0surface-boolean';
import { distance } from '@jsxcad/math-vec3';
import { measureBoundingSphere } from '@jsxcad/geometry-surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './transform';

const doesNotOverlap = ([centerA, radiusA], [centerB, radiusB]) => distance(centerA, centerB) >= radiusA + radiusB;

export const difference = (baseSurface, ...surfaces) => {
  if (baseSurface.length === 0) {
    // Empty geometry can't get more empty.
    return [];
  }
  const baseBounds = measureBoundingSphere(baseSurface);
  surfaces = surfaces.filter(surface => surface.length >= 1 && !doesNotOverlap(baseBounds, measureBoundingSphere(surface)));
  if (surfaces.length === 0) {
    // Nothing to be removed.
    return baseSurface;
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surfaces[0]));
  const z0Surface = differenceZ0Surfaces(...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};
