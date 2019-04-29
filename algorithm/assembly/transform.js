import { map } from './map';
import { transform as transformPaths } from '@jsxcad/algorithm-paths';
import { transform as transformPoints } from '@jsxcad/algorithm-points';
import { transform as transformSolid } from '@jsxcad/algorithm-solid';
import { transform as transformSurface } from '@jsxcad/algorithm-surface';

const transformItem = (matrix, item) => {
  const transformed = {};
  if (item.assembly) {
    transformed.assembly = item.assembly;
  }
  if (item.paths) {
    transformed.paths = transformPaths(matrix, item.paths);
  }
  if (item.points) {
    transformed.points = transformPoints(matrix, item.points);
  }
  if (item.solid) {
    transformed.solid = transformSolid(matrix, item.solid);
  }
  if (item.z0Surface) {
    // FIX: Handle transformations that take the surface out of z0.
    transformed.z0Surface = transformSurface(matrix, item.z0Surface);
  }
  transformed.tags = item.tags;
  return transformed;
};

export const transform = (matrix, assembly) => map(assembly, item => transformItem(matrix, item));
