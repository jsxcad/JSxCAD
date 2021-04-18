import {
  fromPaths as fromPathsToGraph,
  union as graphUnion,
  toPaths as toPathsFromGraph,
} from '@jsxcad/geometry-graph';

import { cache } from '@jsxcad/cache';
import { getNonVoidFaceablePaths } from './getNonVoidFaceablePaths.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPoints } from './getNonVoidPoints.js';
import { union as pointsUnion } from '@jsxcad/geometry-points';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedPaths } from './taggedPaths.js';
import { taggedPoints } from './taggedPoints.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

// Union is a little more complex, since it can violate disjointAssembly invariants.
const unionImpl = (geometry, ...geometries) => {
  geometries = geometries.map(toDisjointGeometry);
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let unified = geometry.graph;
        for (const geometry of geometries) {
          for (const { graph } of getNonVoidGraphs(geometry)) {
            unified = graphUnion(unified, graph);
          }
          for (const { paths } of getNonVoidFaceablePaths(geometry)) {
            unified = graphUnion(unified, fromPathsToGraph(paths));
          }
        }
        if (unified.hash) {
          throw Error(`hash`);
        }
        return taggedGraph({ tags }, unified);
      }
      case 'paths': {
        if (tags && tags.includes('path/Wire')) {
          return geometry;
        }
        return taggedPaths(
          { tags },
          toPathsFromGraph(
            union(
              taggedGraph({ tags }, fromPathsToGraph(geometry.paths)),
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
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
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

  return rewrite(toDisjointGeometry(geometry), op);
};

export const union = cache(unionImpl);
