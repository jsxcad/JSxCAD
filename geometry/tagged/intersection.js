import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getNonVoidFaceablePaths } from './getNonVoidFaceablePaths.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { intersection as graphIntersection } from '../graph/intersection.js';
import { rewrite } from './visit.js';
import { taggedGroup } from './taggedGroup.js';
import { taggedPaths } from './taggedPaths.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { toPaths as toPathsFromGraph } from '../graph/toPaths.js';

export const intersection = (geometry, ...geometries) => {
  geometries = geometries.map(toConcreteGeometry);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let input = geometry;
        const intersections = [];
        for (const geometry of geometries) {
          for (const graph of getNonVoidGraphs(geometry)) {
            intersections.push(graphIntersection(input, graph));
          }
          for (const pathsGeometry of getNonVoidFaceablePaths(geometry)) {
            intersections.push(
              graphIntersection(
                { tags },
                fromPathsToGraph(
                  { tags: pathsGeometry.tags },
                  pathsGeometry.paths
                )
              )
            );
          }
        }
        return taggedGroup({ tags }, ...intersections);
      }
      case 'paths': {
        if (tags && tags.includes('paths/Wire')) {
          return geometry;
        }
        return taggedPaths(
          { tags },
          toPathsFromGraph(
            intersection(
              fromPathsToGraph({ tags }, geometry.paths),
              ...geometries
            )
          )
        );
      }
      case 'segments':
      case 'points': {
        // Not implemented yet.
        return geometry;
      }
      case 'layout':
      case 'plan':
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for intersection.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toConcreteGeometry(geometry), op);
};
