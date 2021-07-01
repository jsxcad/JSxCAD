import { flip as flipPaths } from '../paths/flip.js';
import { flip as flipPoints } from '../points/flip.js';

import { rewrite } from './visit.js';

export const flip = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'points':
        return { ...geometry, points: flipPoints(geometry.points) };
      case 'paths':
        return { ...geometry, paths: flipPaths(geometry.paths) };
      case 'group':
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
