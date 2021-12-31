import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

const doNothing = (geometry) => geometry;

export const op =
  (
    {
      graph = doNothing,
      layout = doNothing,
      paths = doNothing,
      points = doNothing,
      segments = doNothing,
      triangles = doNothing,
    },
    method = rewrite
  ) =>
  (geometry, ...args) => {
    const walk = (geometry, descend) => {
      switch (geometry.type) {
        case 'graph':
          return graph(geometry, ...args);
        case 'layout':
          return layout(geometry, ...args);
        case 'paths':
          return paths(geometry, ...args);
        case 'points':
          return points(geometry, ...args);
        case 'segments':
          return segments(geometry, ...args);
        case 'triangles':
          return triangles(geometry, ...args);
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

    return method(toConcreteGeometry(geometry), walk);
  };
