import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';
import { canonicalize as canonicalizePoints } from '@jsxcad/geometry-points';
import { canonicalize as canonicalizeSolid } from '@jsxcad/geometry-solid';
import { canonicalize as canonicalizeSurface } from '@jsxcad/geometry-surface';

export const canonicalize = (geometry) => {
  const canonicalized = {};
  if (geometry.points) {
    canonicalized.points = canonicalizePoints(geometry.points);
  }
  if (geometry.paths) {
    canonicalized.paths = canonicalizePaths(geometry.paths);
  }
  if (geometry.z0Surface) {
    canonicalized.z0Surface = canonicalizeSurface(geometry.z0Surface);
  }
  if (geometry.solid) {
    canonicalized.solid = canonicalizeSolid(geometry.solid);
  }
  if (geometry.assembly) {
    canonicalized.assembly = geometry.assembly.map(canonicalize);
  }
  if (geometry.tags !== undefined) {
    canonicalized.tags = geometry.tags;
  }
  return canonicalized;
};
