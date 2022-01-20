import { extrude as extrudeGraph } from '../graph/extrude.js';
import { fill } from './fill.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { reify } from './reify.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const extrude = (geometry, height, depth, direction) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return extrudeGraph(
          geometry,
          height,
          depth,
          reify(direction(geometry))
        );
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'polygonsWithHoles':
        return extrude(
          fromPolygonsWithHolesToGraph(geometry),
          height,
          depth,
          direction
        );
      case 'paths':
        return extrude(fill(geometry), height, depth, direction);
      case 'plan':
        return extrude(reify(geometry).content[0], height, depth, direction);
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

  // CHECK: Why does this need transformed geometry?
  return rewrite(toTransformedGeometry(geometry), op);
};
