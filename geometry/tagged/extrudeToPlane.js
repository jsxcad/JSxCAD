import { extrudeToPlane as extrudeToPlaneOfGraph } from '../graph/extrudeToPlane.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const extrudeToPlane = (geometry, highPlane, lowPlane, direction) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return extrudeToPlaneOfGraph(
          geometry.graph,
          highPlane,
          lowPlane,
          direction
        );
      case 'triangles':
      case 'paths':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'plan':
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for extrudeToPlane.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
