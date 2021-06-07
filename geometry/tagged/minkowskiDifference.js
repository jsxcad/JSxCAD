import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { minkowskiDifference as minkowskiDifferenceOfGraphs } from '../graph/minkowskiDifference.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const minkowskiDifference = (geometry, offset) => {
  offset = reify(offset);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        const differences = [];
        for (const { graph } of getNonVoidGraphs(offset)) {
          differences.push(
            taggedGraph(
              { tags },
              minkowskiDifferenceOfGraphs(geometry.graph, graph)
            )
          );
        }
        return taggedGroup({}, ...differences);
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return minkowskiDifference(reify(geometry).content[0], offset);
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
