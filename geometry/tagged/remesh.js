import { reify } from './reify.js';
import { remesh as remeshGraph } from '../graph/remesh.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const remesh = (geometry, options) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        return remeshGraph(geometry, options);
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return remesh(reify(geometry).content[0], options);
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for remesh.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
