import { realizeGraph } from '../graph/realizeGraph.js';
import { rewrite } from './visit.js';

export const realize = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return realizeGraph(geometry);
      case 'displayGeometry':
      case 'triangles':
      case 'points':
      case 'paths':
      case 'polygonsWithHoles':
        // No lazy representation to realize.
        return geometry;
      case 'plan':
      case 'item':
      case 'group':
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
