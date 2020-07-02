import { canonicalize as canonicalizeVec3 } from '@jsxcad/math-vec3';
import { map } from './map.js';

export const canonicalize = (polygon) => map(polygon, canonicalizeVec3);
