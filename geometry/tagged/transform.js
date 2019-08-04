import { transform as transformPaths } from '@jsxcad/geometry-paths';
import { transform as transformPoints } from '@jsxcad/geometry-points';
import { transform as transformSolid } from '@jsxcad/geometry-solid';
import { transform as transformSurface } from '@jsxcad/geometry-surface';

export const transformItem = (matrix, item) => {
  const transformed = {};
  if (item.assembly) {
    transformed.assembly = item.assembly;
  } else if (item.disjointAssembly) {
    transformed.disjointAssembly = item.disjointAssembly;
  } else if (item.paths) {
    transformed.paths = transformPaths(matrix, item.paths);
  } else if (item.points) {
    transformed.points = transformPoints(matrix, item.points);
  } else if (item.solid) {
    transformed.solid = transformSolid(matrix, item.solid);
    if (item.solid.isConvex !== undefined) transformed.solid.isConvex = item.solid.isConvex;
  } else if (item.surface) {
    transformed.surface = transformSurface(matrix, item.surface);
  } else if (item.z0Surface) {
    // FIX: Consider transforms that preserve z0.
    transformed.surface = transformSurface(matrix, item.z0Surface);
  } else if (item.empty) {
    transformed.empty = true;
  } else {
    throw Error(`die: ${JSON.stringify(item)}`);
  }
  transformed.tags = item.tags;
  return transformed;
};

export const transform = (matrix, untransformed) => ({ matrix, untransformed, tags: untransformed.tags });
