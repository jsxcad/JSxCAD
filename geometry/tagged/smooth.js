import { rewrite } from './visit.js';
import { smooth as smoothGraph } from '@jsxcad/geometry-graph';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const smooth = (geometry, options) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        return taggedGraph({ tags }, smoothGraph(geometry.graph, options));
      }
      case 'solid':
      case 'z0Surface':
      case 'surface':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for smooth.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
