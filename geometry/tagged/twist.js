import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';
import { twist as twistGraph } from '../graph/twist.js';

export const twist = (geometry, degreesPerMm, axis) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        return twistGraph(geometry, degreesPerMm, axis);
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return twist(reify(geometry).content[0], degreesPerMm, axis);
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for twist.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
