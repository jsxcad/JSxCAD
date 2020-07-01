import { cache } from '@jsxcad/cache';

const fromSurfaceToPathsImpl = (surface) => {
  return { type: 'paths', paths: surface };
};

export const fromSurfaceToPaths = cache(fromSurfaceToPathsImpl);
