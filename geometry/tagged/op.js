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
      polygonsWithHoles = doNothing,
      segments = doNothing,
      toolpath = doNothing,
      triangles = doNothing,
    },
    method = rewrite,
    accumulate = (x) => x
  ) =>
  (geometry, ...args) => {
    const walk = (geometry, descend) => {
      switch (geometry.type) {
        case 'graph':
          return accumulate(graph(geometry, ...args));
        case 'paths':
          return accumulate(paths(geometry, ...args));
        case 'points':
          return accumulate(points(geometry, ...args));
        case 'polygonsWithHoles':
          return accumulate(polygonsWithHoles(geometry, ...args));
        case 'segments':
          return accumulate(segments(geometry, ...args));
        case 'toolpath':
          return accumulate(toolpath(geometry, ...args));
        case 'triangles':
          return accumulate(triangles(geometry, ...args));
        case 'plan':
          reify(geometry);
        // fall through
        case 'layout':
        // return accumulate(layout(geometry, ...args));
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
