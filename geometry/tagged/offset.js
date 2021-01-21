import {
  fromPaths as fromPathsToGraph,
  offset as offsetGraph,
  toPaths as toPathsFromGraph,
} from '@jsxcad/geometry-graph';

import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedPaths } from './taggedPaths.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const offset = (geometry, initial = 1, step, limit) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedPaths(
          { tags },
          toPathsFromGraph(offsetGraph(geometry.graph, initial, step, limit))
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
            offsetGraph(fromPathsToGraph(geometry.paths), initial, step, limit)
          )
        );
      case 'plan':
        return offset(reify(geometry).content[0], initial, step, limit);
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for offset.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
