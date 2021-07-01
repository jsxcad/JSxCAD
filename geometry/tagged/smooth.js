import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { smooth as smoothGraph } from '../graph/smooth.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const smooth = (geometry, options) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        return taggedGraph({ tags }, smoothGraph(geometry.graph, options));
      }
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return smooth(reify(geometry).content[0], options);
      case 'item':
      case 'group': {
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
