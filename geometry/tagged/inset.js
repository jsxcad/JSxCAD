import {
  fromPaths as fromPathsToGraph,
  inset as insetGraph,
  toPaths as toPathsFromGraph,
} from '@jsxcad/geometry-graph';

import { rewrite } from './visit.js';
import { taggedPaths } from './taggedPaths.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const inset = (geometry, initial = 1, step, limit) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedPaths(
          { tags },
          toPathsFromGraph(insetGraph(geometry.graph, initial, step, limit))
        );
      case 'solid':
      case 'z0Surface':
      case 'surface':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return taggedPaths(
          { tags },
          toPathsFromGraph(
            insetGraph(fromPathsToGraph(geometry.paths), initial, step, limit)
          )
        );
      case 'plan':
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
