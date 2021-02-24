import { flip as flipPaths } from '@jsxcad/geometry-paths';
import { flip as flipPoints } from '@jsxcad/geometry-points';

import { rewrite } from './visit.js';

export const flip = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'points':
        return { ...geometry, points: flipPoints(geometry.points) };
      case 'paths':
        return { ...geometry, paths: flipPaths(geometry.paths) };
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
