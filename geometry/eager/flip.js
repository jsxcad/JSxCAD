import { flip as flipPaths } from '@jsxcad/geometry-paths';
import { flip as flipPoints } from '@jsxcad/geometry-points';
import { flip as flipSolid } from '@jsxcad/geometry-solid';
import { flip as flipSurface } from '@jsxcad/geometry-surface';

const flipEntry = (entry) => {
  const flipped = {};
  if (entry.points) {
    flipped.points = flipPoints(entry.points);
  }
  if (entry.paths) {
    flipped.paths = flipPaths(entry.paths);
  }
  if (entry.surface) {
    flipped.surface = flipSurface(entry.surface);
  }
  if (entry.solid) {
    flipped.solid = flipSolid(entry.solid);
  }
  if (entry.assembly) {
    flipped.assembly = flip(entry.assembly);
  }
  flipped.tags = entry.tags;
  return flipped;
};

export const flip = (assembly) => assembly.map(flipEntry);
