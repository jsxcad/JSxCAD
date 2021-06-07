import { toDisjointGeometry } from './toDisjointGeometry.js';
import { toPolygonsWithHoles as toPolygonsWithHolesFromGraph } from '../graph/toPolygonsWithHoles.js';
import { visit } from './visit.js';

export const toPolygonsWithHoles = (geometry) => {
  const output = [];

  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        for (const {
          plane,
          exactPlane,
          polygonsWithHoles,
        } of toPolygonsWithHolesFromGraph(geometry.graph)) {
          // FIX: Are we going to make polygonsWithHoles proper geometry?
          output.push({
            tags: geometry.tags,
            type: 'polygonsWithHoles',
            plane,
            exactPlane,
            polygonsWithHoles,
          });
        }
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

  visit(toDisjointGeometry(geometry), op);

  return output;
};
