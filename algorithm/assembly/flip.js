import { flip as flipPaths } from '@jsxcad/algorithm-paths';
import { flip as flipPoints } from '@jsxcad/algorithm-points';
import { flip as flipSolid } from '@jsxcad/algorithm-solid';
import { flip as flipSurface } from '@jsxcad/algorithm-surface';

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
