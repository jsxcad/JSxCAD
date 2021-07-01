import { eachPoint as eachPointOfGraph } from '../graph/eachPoint.js';
import { eachPoint as eachPointOfPaths } from '../paths/eachPoint.js';
import { eachPoint as eachPointOfPoints } from '../points/eachPoint.js';
import { reify } from './reify.js';
import { visit } from './visit.js';

export const eachPoint = (emit, geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'plan':
        reify(geometry);
      // fallthrough
      case 'group':
      case 'item':
      case 'layout':
        return descend();
      case 'points':
        return eachPointOfPoints(emit, geometry.points);
      case 'paths':
        return eachPointOfPaths(emit, geometry.paths);
      case 'graph':
        return eachPointOfGraph(geometry, emit);
      default:
        throw Error(
          `Unexpected geometry ${geometry.type} ${JSON.stringify(geometry)}`
        );
    }
  };
  visit(geometry, op);
};
