import { flip as flipPaths } from '@jsxcad/geometry-paths';
import { flip as flipPoints } from '@jsxcad/geometry-points';
import { flip as flipSolid } from '@jsxcad/geometry-solid';
import { flip as flipSurface } from '@jsxcad/geometry-surface';

export const flip = (geometry) => {
  const flipped = {};
  if (geometry.points) {
    flipped.points = flipPoints(geometry.points);
  } else if (geometry.paths) {
    flipped.paths = flipPaths(geometry.paths);
  } else if (geometry.surface) {
    flipped.surface = flipSurface(geometry.surface);
  } else if (geometry.z0Surface) {
    flipped.z0surface = flipSurface(geometry.z0Surface);
  } else if (geometry.solid) {
    flipped.solid = flipSolid(geometry.solid);
  } else if (geometry.assembly) {
    flipped.assembly = geometry.assembly.map(flip);
  } else if (geometry.disjointAssembly) {
    flipped.assembly = geometry.disjointAssembly.map(flip);
    flipped.nonNegative = geometry.nonNegative.map(flip);
  } else if (geometry.plan) {
    // FIX: How should plans deal with flip?
    flipped.plan = geometry.plan;
    flipped.marks = geometry.marks;
  } else if (geometry.item) {
    // FIX: How should items deal with flip?
    flipped.item = geometry.item;
  } else {
    throw Error(`die: ${JSON.stringify(geometry)}`);
  }
  flipped.tags = geometry.tags;
  return flipped;
};
