import { cache } from '@jsxcad/cache';

const fromPathsToZ0SurfaceImpl = (paths) => {
  return { type: 'z0Surface', z0Surface: paths };
};

export const fromPathsToZ0Surface = cache(fromPathsToZ0SurfaceImpl);
