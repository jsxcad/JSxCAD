import { eachPoint as eachPointOfPaths } from '@jsxcad/geometry-paths';
import { eachPoint as eachPointOfPoints } from '@jsxcad/geometry-points';
import { eachPoint as eachPointOfSolid } from '@jsxcad/geometry-solid';
import { eachPoint as eachPointOfSurface } from '@jsxcad/geometry-surface';

export const eachPoint = (operation, geometry) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.layers) {
      geometry.layers.forEach(walk);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
    } else if (geometry.item) {
      walk(geometry.item);
    } else if (geometry.points) {
      eachPointOfPoints(operation, geometry.points);
    } else if (geometry.paths) {
      eachPointOfPaths(operation, geometry.paths);
    } else if (geometry.solid) {
      eachPointOfSolid(operation, geometry.solid);
    } else if (geometry.surface) {
      eachPointOfSurface(operation, geometry.surface);
    } else if (geometry.z0Surface) {
      eachPointOfSurface(operation, geometry.z0Surface);
    }
  };

  walk(geometry);
};
