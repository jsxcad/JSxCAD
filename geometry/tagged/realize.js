import { realizeGraph } from '@jsxcad/geometry-graph';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';

export const realize = (geometry) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedGraph({ tags }, realizeGraph(geometry.graph));
      case 'displayGeometry':
      case 'triangles':
      case 'points':
      case 'paths':
        // No lazy representation to realize.
        return geometry;
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers':
      case 'layout':
      case 'sketch':
      case 'transform':
        return descend();
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};
