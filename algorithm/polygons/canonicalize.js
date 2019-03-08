import { canonicalize as canonicalizeOfPoly3 } from '@jsxcad/math-poly3';

export const canonicalize = polygons => polygons.map(canonicalizeOfPoly3);
