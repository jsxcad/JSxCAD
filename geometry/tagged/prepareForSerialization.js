import { prepareForSerialization as prepareForSerializationOfGraph } from '../graph/prepareForSerialization.js';
import { visit } from './visit.js';

export const prepareForSerialization = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        prepareForSerializationOfGraph(geometry);
        return;
      case 'displayGeometry':
      case 'triangles':
      case 'points':
      case 'paths':
        return;
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

  visit(geometry, op);

  return geometry;
};
