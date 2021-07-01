import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const op =
  ({ graph }) =>
  (geometry, ...args) => {
    const walk = (geometry, descend) => {
      switch (geometry.type) {
        case 'graph': {
          return graph(geometry, ...args);
        }
        case 'triangles':
        case 'paths':
        case 'points':
          // Not implemented yet.
          return geometry;
        case 'plan':
          reify(geometry);
        // fall through
        case 'item':
        case 'group': {
          return descend();
        }
        case 'sketch': {
          // Sketches aren't real for op.
          return geometry;
        }
        default:
          throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
      }
    };

    return rewrite(toTransformedGeometry(geometry), walk);
  };
