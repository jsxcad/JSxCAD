import { eachPoint as eachPointOfPaths } from '@jsxcad/geometry-paths';
import { eachPoint as eachPointOfPoints } from '@jsxcad/geometry-points';
import { eachPoint as eachPointOfSolid } from '@jsxcad/geometry-solid';
import { eachPoint as eachPointOfSurface } from '@jsxcad/geometry-surface';

export const eachPoint = (options, operation, geometry) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
    } else if (geometry.points) {
      eachPointOfPoints(options, operation, geometry.points);
    } else if (geometry.paths) {
      eachPointOfPaths(options, operation, geometry.paths);
    } else if (geometry.solid) {
      eachPointOfSolid(options, operation, geometry.solid);
    } else if (geometry.z0Surface) {
      eachPointOfSurface(options, operation, geometry.z0Surface);
    }
  };

  walk(geometry);
};
