import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { projectToPlane as projectToPlaneOfGraph } from '../graph/projectToPlane.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const projectToPlane = (geometry, plane, direction) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        return taggedGraph(
          { tags },
          projectToPlaneOfGraph(geometry.graph, plane, direction)
        );
      }
      case 'triangles':
      case 'points':
        // Not implemented yet.
        return geometry;
      case 'paths':
        return projectToPlane(
          taggedGraph({ tags }, fromPathsToGraph(geometry.paths)),
          plane,
          direction
        );
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
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
