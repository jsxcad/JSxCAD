import { cache } from '@jsxcad/cache';

const assembleImpl = (...taggedGeometries) => ({
  type: 'assembly',
  content: taggedGeometries,
});

export const assemble = cache(assembleImpl);
