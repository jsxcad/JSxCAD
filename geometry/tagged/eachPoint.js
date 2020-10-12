import { eachPoint as eachPointOfGraph } from '@jsxcad/geometry-graph';
import { eachPoint as eachPointOfPaths } from '@jsxcad/geometry-paths';
import { eachPoint as eachPointOfPoints } from '@jsxcad/geometry-points';
import { eachPoint as eachPointOfSolid } from '@jsxcad/geometry-solid';
import { eachPoint as eachPointOfSurface } from '@jsxcad/geometry-surface';
import { visit } from './visit.js';

export const eachPoint = (emit, geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'item':
      case 'layout':
        return descend();
      case 'points':
        return eachPointOfPoints(emit, geometry.points);
      case 'paths':
        return eachPointOfPaths(emit, geometry.paths);
      case 'solid':
        return eachPointOfSolid(emit, geometry.solid);
      case 'surface':
        return eachPointOfSurface(emit, geometry.surface);
      case 'z0Surface':
        return eachPointOfSurface(emit, geometry.z0Surface);
      case 'graph':
        return eachPointOfGraph(geometry.graph, emit);
      default:
        throw Error(
          `Unexpected geometry ${geometry.type} ${JSON.stringify(geometry)}`
        );
    }
  };
  visit(geometry, op);
};
