import { map } from './map';
import { eachPoint as eachPointOfPaths } from '@jsxcad/algorithm-paths';
import { eachPoint as eachPointOfSolid } from '@jsxcad/algorithm-solid';
import { eachPoint as eachPointOfSurface } from '@jsxcad/algorithm-surface';

export const eachPoint = (options, operation, geometry) => {
  map(geometry,
      (geometry) => {
        if (geometry.paths) {
          eachPointOfPaths(options, operation, geometry.paths);
        }
        if (geometry.solid) {
          eachPointOfSolid(options, operation, geometry.solid);
        }
        if (geometry.z0Surface) {
          eachPointOfSurface(options, operation, geometry.z0Surface);
        }
      });
}
