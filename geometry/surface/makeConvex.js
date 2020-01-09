import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { makeConvex as makeConvexZ0Surface } from '@jsxcad/geometry-z0surface';
import { toPlane } from './toPlane';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './ops';

export const makeConvex = (surface, normalize3 = createNormalize3(), plane) => {
  if (surface.length === undefined) {
    throw Error('die');
  }
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  if (surface.length === 1 && surface[0].length === 3) {
    // A surface that is a triangle is convex.
    return surface;
  }
  if (plane === undefined) {
    plane = toPlane(surface);
  }
  const [to, from] = toXYPlaneTransforms(plane);
  const convexZ0Surface = makeConvexZ0Surface(transform(to, surface.map(path => path.map(normalize3))));
  const convexSurface = transform(from, convexZ0Surface).map(path => path.map(normalize3));
  return convexSurface;
};
