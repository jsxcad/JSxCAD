import { cache } from '@jsxcad/cache';
import { taggedAssembly } from './taggedAssembly.js';

const assembleImpl = (...taggedGeometries) =>
  taggedAssembly({}, ...taggedGeometries);

export const assemble = cache(assembleImpl);
