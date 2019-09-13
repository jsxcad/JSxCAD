import { cache } from '@jsxcad/cache';

const fromPathToSurfaceImpl = (path) => {
  return { surface: [path] };
};

export const fromPathToSurface = cache(fromPathToSurfaceImpl);
