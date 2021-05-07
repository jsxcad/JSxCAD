import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { minkowskiShell as minkowskiShellOfGraphs } from '@jsxcad/geometry-graph';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const minkowskiShell = (geometry, offset) => {
  offset = reify(offset);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        const sums = [];
        for (const { graph } of getNonVoidGraphs(offset)) {
          sums.push(
            taggedGraph({ tags }, minkowskiShellOfGraphs(geometry.graph, graph))
          );
        }
        return taggedGroup({}, ...sums);
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return minkowskiShell(reify(geometry).content[0], offset);
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
