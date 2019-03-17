import { canonicalize as canonicalizeVec3 } from '@jsxcad/math-vec3';

export const canonicalize = ([a, b, c]) => [canonicalizeVec3(a), canonicalizeVec3(b), canonicalizeVec3(c)];
