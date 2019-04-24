import { transform as transformPaths } from '@jsxcad/algorithm-paths';
import { transform as transformPoints } from '@jsxcad/algorithm-points';
import { transform as transformSolid } from '@jsxcad/algorithm-solid';
import { transform as transformSurface } from '@jsxcad/algorithm-surface';

const transformEntry = (entry) => {
  const transformed = {};
  if (entry.points) {
    transformed.points = transformPoints(entry.points);
  }
  if (entry.paths) {
    transformed.paths = transformPaths(entry.paths);
  }
  if (entry.surface) {
    transformed.surface = transformSurface(entry.surface);
  }
  if (entry.solid) {
    transformed.solid = transformSolid(entry.solid);
  }
  if (entry.assembly) {
    transformed.assembly = transform(entry.assembly);
  }
  transformed.tags = entry.tags;
  return transformed;
};

export const transform = (assembly) => assembly.map(transformEntry);
