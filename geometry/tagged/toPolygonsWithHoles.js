import { toPolygonsWithHoles as toPolygonsWithHolesFromGraph } from '@jsxcad/geometry-graph';
import { toTransformedGeometry } from './toTransformedGeometry.js';
import { visit } from './visit.js';

export const toPolygonsWithHoles = (geometry) => {
  const polygonsWithHoles = [];

  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        polygonsWithHoles.push({
          tags: geometry.tags,
          polygonsWithHoles: toPolygonsWithHolesFromGraph(geometry.graph),
        });
        break;
      }
      // FIX: Support 'triangles'?
      case 'points':
      case 'paths':
        break;
      case 'layout':
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'sketch':
      case 'layers': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  visit(toTransformedGeometry(geometry), op);

  return polygonsWithHoles;
};
