import { canonicalize as canonicalizeOfPath } from '@jsxcad/algorithm-path';

export const canonicalize = (paths) => {
  let canonicalized = paths.map(canonicalizeOfPath);
  // Transfer properties.
  if (paths.tags !== undefined) {
    canonicalized.tags = paths.tags;
  }
  return canonicalized;
};
