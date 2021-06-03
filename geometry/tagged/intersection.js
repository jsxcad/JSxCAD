import { cache } from '@jsxcad/cache';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getNonVoidFaceablePaths } from './getNonVoidFaceablePaths.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { intersection as graphIntersection } from '../graph/intersection.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { taggedPaths } from './taggedPaths.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';
import { toPaths as toPathsFromGraph } from '../graph/toPaths.js';

const intersectionImpl = (geometry, ...geometries) => {
  geometries = geometries.map(toDisjointGeometry);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let input = geometry.graph;
        const intersections = [];
        for (const geometry of geometries) {
          for (const graph of getNonVoidGraphs(geometry)) {
            intersections.push(graphIntersection(input, graph));
          }
          for (const { paths } of getNonVoidFaceablePaths(geometry)) {
            intersections.push(
              taggedGraph(
                { tags },
                graphIntersection(input, fromPathsToGraph(paths))
              )
            );
          }
        }
        if (intersection.hash) {
          throw Error(`hash`);
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
              taggedGraph({ tags }, fromPathsToGraph(geometry.paths)),
              ...geometries
            ).graph
          )
        );
      }
      case 'points': {
        // Not implemented yet.
        return geometry;
      }
      case 'layout':
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
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

  return rewrite(toDisjointGeometry(geometry), op);
};

export const intersection = cache(intersectionImpl);
