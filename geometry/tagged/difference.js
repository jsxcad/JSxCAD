import { cache } from '@jsxcad/cache';
import { fill as fillOutlineGraph } from '../graph/fill.js';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getFaceablePaths } from './getFaceablePaths.js';
import { getGraphs } from './getGraphs.js';
import { difference as graphDifference } from '../graph/difference.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

const differenceImpl = (geometry, ...geometries) => {
  geometries = geometries.map(toConcreteGeometry);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let differenced = geometry;
        for (const geometry of geometries) {
          for (const graph of getGraphs(geometry)) {
            differenced = graphDifference(differenced, graph);
          }
          for (const { paths } of getFaceablePaths(geometry)) {
            differenced = graphDifference(
              differenced,
              fillOutlineGraph(
                fromPathsToGraph(paths.map((path) => ({ points: path })))
              )
            );
          }
        }
        if (differenced.hash) {
          throw Error(`hash`);
        }
        return differenced;
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

  return rewrite(toConcreteGeometry(geometry), op);
};

export const difference = cache(differenceImpl);
