import { computeCentroid as computeCentroidOfGraph } from '../graph/computeCentroid.js';
import { fill } from './fill.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const computeCentroid = (geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return computeCentroidOfGraph(geometry);
      case 'polygonsWithHoles':
        return computeCentroidOfGraph(fromPolygonsWithHolesToGraph(geometry));
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return computeCentroid(fill(geometry));
      case 'plan':
        return computeCentroid(reify(geometry).content[0]);
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
