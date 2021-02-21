import {
  fromPaths as fromPathsToGraph,
  inset as insetGraph,
} from '@jsxcad/geometry-graph';

import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const inset = (geometry, initial = 1, step, limit) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedGraph(
          { tags },
          insetGraph(geometry.graph, initial, step, limit)
        );
      case 'solid':
      case 'z0Surface':
      case 'surface':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return taggedGraph(
          { tags },
          insetGraph(fromPathsToGraph(geometry.paths), initial, step, limit)
        );
      case 'plan':
        return inset(reify(geometry).content[0], initial, step, limit);
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for inset.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
