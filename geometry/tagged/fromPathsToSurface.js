import { cache } from '@jsxcad/cache';
import { makeConvex } from '@jsxcad/geometry-surface';

const fromPathsToSurfaceImpl = (paths) => {
  return { type: 'surface', surface: makeConvex(paths) };
};

export const fromPathsToSurface = cache(fromPathsToSurfaceImpl);
