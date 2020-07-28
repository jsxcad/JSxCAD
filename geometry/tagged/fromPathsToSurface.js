import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { makeConvex } from '@jsxcad/geometry-surface';
import { taggedSurface } from './taggedSurface.js';

const fromPathsToSurfaceImpl = (paths) => {
  return taggedSurface({}, makeConvex(paths, createNormalize3()));
};

export const fromPathsToSurface = cache(fromPathsToSurfaceImpl);
