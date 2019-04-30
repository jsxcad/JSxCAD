import { canonicalize as canonicalizeSurface } from '@jsxcad/algorithm-surface';

export const canonicalize = (solid) => solid.map(canonicalizeSurface);
