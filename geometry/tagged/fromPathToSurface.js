import { cache } from '@jsxcad/cache';
import { fromPathsToSurface } from './fromPathsToSurface.js';

const fromPathToSurfaceImpl = (path) => fromPathsToSurface([path]);

export const fromPathToSurface = cache(fromPathToSurfaceImpl);
