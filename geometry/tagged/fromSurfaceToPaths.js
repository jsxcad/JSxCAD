import { cache } from '@jsxcad/cache';

const fromSurfaceToPathsImpl = (surface) => {
  return { paths: surface };
};

export const fromSurfaceToPaths = cache(fromSurfaceToPathsImpl);
