import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { projectToPlane as projectToPlaneOfGraph } from '../graph/projectToPlane.js';
import { rewrite } from './visit.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const projectToPlane = (geometry, plane, direction) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        return projectToPlaneOfGraph(geometry, plane, direction);
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return projectToPlane(
          fromPathsToGraph(geometry.paths),
          plane,
          direction
        );
      case 'plan':
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for projectToPlane.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toTransformedGeometry(geometry), op);
};
