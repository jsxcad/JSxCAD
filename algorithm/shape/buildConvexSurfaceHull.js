import ConvexHull2d from 'monotone-convex-hull-2d';
import { cache } from '@jsxcad/cache';
import { makeConvex } from '@jsxcad/geometry-z0surface-boolean';

const buildConvexSurfaceHullImpl = (points) => {
  const hull = [];
  for (const nth of ConvexHull2d(points)) {
    hull.push(points[nth]);
  }
  // Do we need makeConvex here?
  return makeConvex([hull.reverse()]);
};

export const buildConvexSurfaceHull = cache(buildConvexSurfaceHullImpl);
