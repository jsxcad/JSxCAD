import { canonicalize as canonicalizeVec3 } from '@jsxcad/math-vec3';
import { map } from './map';

export const canonicalize = (polygon) => map(polygon, canonicalizeVec3);
