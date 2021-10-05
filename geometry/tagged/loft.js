import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { loft as loftGraph } from '../graph/loft.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';

export const loft = (closed, geometry, ...geometries) => {
  geometries = geometries.map(reify);
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph': {
        const lofts = [geometry];
        // This is a bit fragile -- let's consider expressing this in terms of transforms.
        for (const otherGeometry of geometries) {
          for (const otherGraphGeometry of getNonVoidGraphs(otherGeometry)) {
            lofts.push(otherGraphGeometry);
          }
        }
        return loftGraph(closed, ...lofts);
      }
      case 'polygonsWithHoles':
        return loft(
          closed,
          fromPolygonsWithHolesToGraph(geometry),
          ...geometries
        );
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
        return loft(closed, reify(geometry).content[0], ...geometries);
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};
