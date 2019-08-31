import { cache } from '@jsxcad/cache';

const fromPathToZ0SurfaceImpl = (path) => ({ z0Surface: [path] });

export const fromPathToZ0Surface = cache(fromPathToZ0SurfaceImpl);
