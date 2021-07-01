import { cache } from '@jsxcad/cache';
import { fromPaths as fromPathsToGraph } from '../graph/fromPaths.js';
import { getNonVoidFaceablePaths } from './getNonVoidFaceablePaths.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPoints } from './getNonVoidPoints.js';
import { union as graphUnion } from '../graph/union.js';
import { union as pointsUnion } from '../points/union.js';
import { rewrite } from './visit.js';
import { taggedPaths } from './taggedPaths.js';
import { taggedPoints } from './taggedPoints.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { toPaths as toPathsFromGraph } from '../graph/toPaths.js';

// Union is a little more complex, since it can violate disjointAssembly invariants.
const unionImpl = (geometry, ...geometries) => {
  geometries = geometries.map(toConcreteGeometry);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let unified = geometry;
        for (const geometry of geometries) {
          for (const graph of getNonVoidGraphs(geometry)) {
            unified = graphUnion(unified, graph);
          }
          for (const pathsGeometry of getNonVoidFaceablePaths(geometry)) {
            unified = graphUnion(
              unified,
              fromPathsToGraph(
                { tags: pathsGeometry.tags },
                pathsGeometry.paths
              )
            );
          }
        }
        if (unified.hash) {
          throw Error(`hash`);
        }
        return unified;
      }
      case 'paths': {
        if (tags && tags.includes('path/Wire')) {
          return geometry;
        }
        return taggedPaths(
          { tags },
          toPathsFromGraph(
            union(
              fromPathsToGraph({ tags: geometry.tags }, geometry.paths),
              ...geometries
            ).graph
          )
        );
      }
      case 'points': {
        const { points, tags } = geometry;
        const pointsets = [];
        for (const { points } of getNonVoidPoints(geometry)) {
          pointsets.push(points);
        }
        return taggedPoints({ tags }, pointsUnion(points, ...pointsets));
      }
      case 'layout':
      case 'plan':
      case 'item':
      case 'group': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for union.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(toConcreteGeometry(geometry), op);
};

export const union = cache(unionImpl);
