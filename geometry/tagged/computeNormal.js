import { computeNormal as computeNormalOfGraph } from '../graph/computeNormal.js';
import { fill } from './fill.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const computeNormal = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return computeNormalOfGraph(geometry);
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return computeNormal(fill(geometry));
      case 'plan':
        return computeNormal(reify(geometry).content[0]);
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for extrude.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
