import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';
import { canonicalize as canonicalizePoints } from '@jsxcad/geometry-points';
import { canonicalize as canonicalizeSolid } from '@jsxcad/geometry-solid';
import { canonicalize as canonicalizeSurface } from '@jsxcad/geometry-surface';
import { toTransformedGeometry } from './toTransformedGeometry';

export const canonicalize = (rawGeometry) => {
  const geometry = toTransformedGeometry(rawGeometry);
  const canonicalized = {};
  if (geometry.points !== undefined) {
    canonicalized.points = canonicalizePoints(geometry.points);
  } else if (geometry.paths !== undefined) {
    canonicalized.paths = canonicalizePaths(geometry.paths);
  } else if (geometry.surface !== undefined) {
    canonicalized.surface = canonicalizeSurface(geometry.surface);
  } else if (geometry.z0Surface !== undefined) {
    canonicalized.z0Surface = canonicalizeSurface(geometry.z0Surface);
  } else if (geometry.solid !== undefined) {
    canonicalized.solid = canonicalizeSolid(geometry.solid);
  } else if (geometry.assembly !== undefined) {
    canonicalized.assembly = geometry.assembly.map(canonicalize);
  } else if (geometry.disjointAssembly !== undefined) {
    canonicalized.disjointAssembly = geometry.disjointAssembly.map(canonicalize);
  } else if (geometry.item !== undefined) {
    canonicalized.item = geometry.item(canonicalize);
  } else {
    throw Error('die');
  }
  if (geometry.tags !== undefined) {
    canonicalized.tags = geometry.tags;
  }
  return canonicalized;
};
