import { cacheTransform } from '@jsxcad/cache';
import { taggedTransform } from './taggedTransform.js';

const transformImpl = (matrix, untransformed) =>
  taggedTransform({}, matrix, untransformed);

export const transform = cacheTransform(transformImpl);
