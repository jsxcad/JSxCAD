import { toTransformedGeometry } from './toTransformedGeometry.js';
import { toTriangles as toTrianglesFromGraph } from '../geometry-graph';
import { visit } from './visit.js';

export const toTriangles = (geometry) => {
  const triangles = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        triangles.push(...toTrianglesFromGraph(geometry.graph));
        break;
      }
      case 'triangles': {
        triangles.push(...geometry.triangles);
        break;
      }
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

  return triangles;
};
