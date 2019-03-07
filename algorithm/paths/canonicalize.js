import { canonicalize as canonicalizeOfPath } from '@jsxcad/algorithm-path';

export const canonicalize = (paths) => paths.map(canonicalizeOfPath);
