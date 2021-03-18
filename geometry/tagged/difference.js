import {
  fill as fillOutlineGraph,
  fromPaths as fromPathsToGraph,
  difference as graphDifference,
} from '@jsxcad/geometry-graph';

import { cache } from '@jsxcad/cache';
import { getFaceablePaths } from './getFaceablePaths.js';
import { getGraphs } from './getGraphs.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
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
            differenced = graphDifference(differenced,
              fillOutlineGraph(
                fromPathsToGraph(paths.map((path) => ({ points: path })))
              ));
          }
        }
        return taggedGraph({ tags }, differenced);
      }
      case 'paths':
        // This will have problems with open paths, but we want to phase this out anyhow.
        return difference(
          taggedGraph(
            { tags },
            fillOutlineGraph(
              fromPathsToGraph(geometry.paths.map((path) => ({ points: path })))
            )
          ),
          ...geometries
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
