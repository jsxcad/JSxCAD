import { prepareForSerialization as prepareForSerializationOfGraph } from '@jsxcad/geometry-graph';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';

export const prepareForSerialization = (geometry) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph':
        return taggedGraph(
          { tags },
          prepareForSerializationOfGraph(geometry.graph)
        );
      case 'displayGeometry':
      case 'triangles':
      case 'points':
      case 'paths':
        return geometry;
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers':
      case 'layout':
      case 'sketch':
      case 'transform':
      case 'plan':
        return descend();
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};
