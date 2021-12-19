import { getClosedGraphs, getGraphs } from './getGraphs.js';

import { cutVolumeIncrementally } from '../graph/cutVolumeIncrementally.js';
import { cutVolumeSingly } from '../graph/cutVolumeSingly.js';
import { cutVolumeSinglyRecursive } from '../graph/cutVolumeSinglyRecursive.js';
import { fill as fillOutlineGraph } from '../graph/fill.js';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getFaceablePaths } from './getFaceablePaths.js';
import { difference as graphDifference } from '../graph/difference.js';
import { rewrite } from './visit.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const difference = (geometry, options = {}, ...geometries) => {
  if (
    !['incremental', 'single', 'single_recursive', 'basic', undefined].includes(
      options.mode
    )
  ) {
    throw Error(`Unknown mode: ${options.mode}`);
  }
  const { check = false, mode = 'incremental' } = options;
  geometries = geometries.map((geometry) => toConcreteGeometry(geometry));
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        if (geometry.graph.isClosed) {
          switch (mode) {
            case 'incremental':
              return cutVolumeIncrementally(
                geometry,
                check,
                geometries.flatMap((geometry) => getClosedGraphs(geometry))
              );
            case 'single':
              return cutVolumeSingly(
                geometry,
                check,
                geometries.flatMap((geometry) => getClosedGraphs(geometry))
              );
            case 'single_recursive':
              return cutVolumeSinglyRecursive(
                geometry,
                check,
                geometries.flatMap((geometry) => getClosedGraphs(geometry))
              );
            case 'basic':
            // fall through
          }
        }

        // general solution.

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
                  pathsGeometry.paths
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
          fillOutlineGraph(fromPathsToGraph({ tags }, geometry.paths)),
          options,
          ...geometries
        );
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
