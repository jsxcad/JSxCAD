import { map } from './map';
import { transform as transformPaths } from '@jsxcad/algorithm-paths';
import { transform as transformPoints } from '@jsxcad/algorithm-points';
import { transform as transformSolid } from '@jsxcad/algorithm-solid';
import { transform as transformSurface } from '@jsxcad/algorithm-surface';

const transformItem = (matrix, item) => {
  const transformed = {};
  if (item.points) {
    transformed.points = transformPoints(matrix, item.points);
  }
  if (item.paths) {
    transformed.paths = transformPaths(matrix, item.paths);
  }
  if (item.surface) {
    transformed.surface = transformSurface(matrix, item.surface);
  }
  if (item.solid) {
    transformed.solid = transformSolid(matrix, item.solid);
  }
  if (item.assembly) {
    transformed.assembly = item.assembly;
  }
  transformed.tags = item.tags;
  return transformed;
};

export const transform = (matrix, assembly) => map(assembly, item => transformItem(matrix, item));
