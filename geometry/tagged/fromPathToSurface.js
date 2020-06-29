import { cache } from '@jsxcad/cache';

const fromPathToSurfaceImpl = (path) => {
  return { type: 'surface', surface: [path] };
};

export const fromPathToSurface = cache(fromPathToSurfaceImpl);
