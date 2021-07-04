import { cache } from '@jsxcad/cache';
import { fill as fillOutlineGraph } from '../graph/fill.js';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getFaceablePaths } from './getFaceablePaths.js';
import { getGraphs } from './getGraphs.js';
import { difference as graphDifference } from '../graph/difference.js';
import { rewrite } from './visit.js';
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
          for (const pathsGeometry of getFaceablePaths(geometry)) {
            differenced = graphDifference(
              differenced,
              fillOutlineGraph(
                fromPathsToGraph(
                  { tags: pathsGeometry.tags },
                  pathsGeometry.map((path) => ({ points: path }))
                )
              )
            );
          }
        }
        return differenced;
      }
      case 'paths':
        // This will have problems with open paths, but we want to phase this out anyhow.
        return difference(
          fillOutlineGraph(
            fromPathsToGraph(
              { tags },
              geometry.paths.map((path) => ({ points: path }))
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

export const difference = cache(differenceImpl);
