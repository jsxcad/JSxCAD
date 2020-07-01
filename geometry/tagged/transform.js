import { cacheTransform } from '@jsxcad/cache';

const transformImpl = (matrix, untransformed) => {
  if (untransformed.length) throw Error('die');
  if (matrix.some((value) => typeof value !== 'number' || isNaN(value))) {
    throw Error('die');
  }
  return {
    type: 'transform',
    matrix,
    content: [untransformed],
    tags: untransformed.tags,
  };
};

export const transform = cacheTransform(transformImpl);
