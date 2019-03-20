import { canonicalize as canonicalizeVec3 } from '@jsxcad/math-vec3';

/**
 * Produce a canonical version of a ray3.
 * @param {ray3} the ray
 * @returns {ray3} the canonical ray3
 */
export const canonicalize = ([point, unitDirection]) => [canonicalizeVec3(point), canonicalizeVec3(unitDirection)];
