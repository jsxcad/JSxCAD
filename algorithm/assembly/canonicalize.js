import { canonicalize as canonicalizePaths } from '@jsxcad/algorithm-paths';
import { canonicalize as canonicalizePoints } from '@jsxcad/algorithm-points';
import { canonicalize as canonicalizeSolid } from '@jsxcad/algorithm-solid';
import { canonicalize as canonicalizeSurface } from '@jsxcad/algorithm-surface';

export const canonicalizeEntry = (entry) => {
  const canonicalized = {};
  if (entry.points) {
    canonicalized.points = canonicalizePoints(entry.points);
  }
  if (entry.paths) {
    canonicalized.paths = canonicalizePaths(entry.paths);
  }
  if (entry.surface) {
    canonicalized.surface = canonicalizeSurface(entry.surface);
  }
  if (entry.solid) {
    canonicalized.solid = canonicalizeSolid(entry.solid);
  }
  if (entry.assembly) {
    canonicalized.assembly = canonicalize(entry.assembly);
  }
  canonicalized.tags = entry.tags;
  return canonicalized;
};

export const canonicalize = (assembly) => assembly.map(canonicalizeEntry);
