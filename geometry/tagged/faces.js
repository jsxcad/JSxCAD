import { faces as facesOfGraph } from '../graph/faces.js';
import { fill } from './fill.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';

export const faces = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return facesOfGraph(geometry);
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return faces(fill(geometry));
      case 'plan':
        return faces(reify(geometry).content[0]);
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for faces.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};
