import { assertGood } from './assertGood';

export const assemble = (...taggedGeometries) => assertGood({ assembly: taggedGeometries });
