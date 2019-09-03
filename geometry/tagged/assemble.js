import { assertGood } from './assertGood';
import { cache } from '@jsxcad/cache';

const assembleImpl = (...taggedGeometries) => assertGood({ assembly: taggedGeometries });

export const assemble = cache(assembleImpl);
