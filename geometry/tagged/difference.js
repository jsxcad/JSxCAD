import {
  fromPaths as fromPathsToGraph,
  difference as graphDifference,
  toPaths as toPathsFromGraph,
} from '@jsxcad/geometry-graph';

import { cache } from '@jsxcad/cache';
import { getFaceablePaths } from './getFaceablePaths.js';
import { getGraphs } from './getGraphs.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedPaths } from './taggedPaths.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

const differenceImpl = (geometry, ...geometries) => {
  geometries = geometries.map(toDisjointGeometry);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let differenced = geometry.graph;
        for (const geometry of geometries) {
          for (const { graph } of getGraphs(geometry)) {
            differenced = graphDifference(differenced, graph);
          }
          for (const { paths } of getFaceablePaths(geometry)) {
            differenced = graphDifference(differenced, fromPathsToGraph(paths));
          }
        }
        return taggedGraph({ tags }, differenced);
      }
      case 'paths':
        if (tags && tags.includes('paths/Wire')) {
          return geometry;
        }
        return taggedPaths(
          { tags },
          toPathsFromGraph(
            difference(
              taggedGraph({ tags }, fromPathsToGraph(geometry.paths)),
              ...geometries
            ).graph
          )
        );
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

export const difference = cache(differenceImpl);
