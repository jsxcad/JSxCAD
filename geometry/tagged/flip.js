import { flip as flipPaths } from '@jsxcad/geometry-paths';
import { flip as flipPoints } from '@jsxcad/geometry-points';
import { flip as flipSolid } from '@jsxcad/geometry-solid';
import { flip as flipSurface } from '@jsxcad/geometry-surface';

import { rewrite } from './visit';

export const flip = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'points':
        return { ...geometry, points: flipPoints(geometry.points) };
      case 'paths':
        return { ...geometry, paths: flipPaths(geometry.paths) };
      case 'surface':
        return { ...geometry, surface: flipSurface(geometry.surface) };
      case 'z0Surface':
        return { ...geometry, surface: flipSurface(geometry.z0Surface) };
      case 'solid':
        return { ...geometry, solid: flipSolid(geometry.solid) };
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'layout':
      case 'plan':
      case 'item':
        return descend();
      default:
        throw Error(`die: ${JSON.stringify(geometry)}`);
    }
  };
  return rewrite(geometry, op);
};
