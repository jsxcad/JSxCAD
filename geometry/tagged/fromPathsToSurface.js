import { cache } from '@jsxcad/cache';
import { makeConvex } from '@jsxcad/geometry-surface';

const fromPathsToSurfaceImpl = (paths) => {
  return { surface: makeConvex(paths) };
};

export const fromPathsToSurface = cache(fromPathsToSurfaceImpl);
