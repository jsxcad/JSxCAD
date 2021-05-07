import { grow as growGraph } from '@jsxcad/geometry-graph';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const grow = (geometry, amount) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedGraph({ tags }, growGraph(geometry.graph, amount));
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return grow(reify(geometry).content[0], amount);
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
