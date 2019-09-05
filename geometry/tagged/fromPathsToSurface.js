import { cache } from '@jsxcad/cache';

const fromPathsToSurfaceImpl = (paths) => {
  return { surface: paths };
};

export const fromPathsToSurface = cache(fromPathsToSurfaceImpl);
