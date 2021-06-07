import { push as pushGraph } from '../graph/push.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const push = (
  geometry,
  { force, minimumDistance, maximumDistance } = {}
) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        return taggedGraph(
          { tags },
          pushGraph(geometry.graph, force, minimumDistance, maximumDistance)
        );
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        // CHECK: Isn't this case made redundant by toTransformedGeometry?
        return push(reify(geometry).content[0], {
          force,
          minimumDistance,
          maximumDistance,
        });
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for push.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
