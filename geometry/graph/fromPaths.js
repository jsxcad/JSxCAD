import { arrangePaths, fitPlaneToPoints } from '@jsxcad/algorithm-cgal';
import { deduplicate, flip, isClockwise } from '@jsxcad/geometry-path';

import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';
import { dot } from '@jsxcad/math-vec3';
import { fromArrangements } from './fromArrangements.js';

const clean = (path) => deduplicate(path);

const orientClockwise = (path) => (isClockwise(path) ? path : flip(path));
const orientCounterClockwise = (path) =>
  isClockwise(path) ? flip(path) : path;

const Z = 2;

// This imposes a planar arrangement.
export const fromPaths = (inputPaths) => {
  const paths = canonicalizePaths(inputPaths);
  const points = [];
  for (const path of paths) {
    for (const point of path) {
      if (point !== null) {
        points.push(point);
      }
    }
  }
  const orientedArrangements = [];
  let plane = fitPlaneToPoints(points);
  if (plane) {
    // Orient planes up by default.
    // FIX: Remove this hack.
    if (dot(plane, [0, 0, 1, 0]) < -0.1) {
      plane[Z] *= -1;
    }
    const arrangement = arrangePaths(...plane, paths);
    for (const { boundary, holes } of arrangement) {
      const exterior = orientCounterClockwise(boundary);
      const cleaned = clean(exterior);
      if (cleaned.length < 3) {
        continue;
      }
      const orientedArrangement = { boundary: cleaned, holes: [], plane };
      // const face = addFace(graph, { plane });
      // addLoopFromPoints(graph, cleaned, { face });
      for (const hole of holes) {
        const interior = orientClockwise(hole);
        const cleaned = clean(interior);
        if (cleaned.length < 3) {
          continue;
        }
        orientedArrangement.holes.push(cleaned);
        // addHoleFromPoints(graph, cleaned, { face });
      }
      orientedArrangements.push(orientedArrangement);
    }
  }
  const graph = fromArrangements(orientedArrangements);
  if (graph.edges.length === 0) {
    graph.isEmpty = true;
  }
  graph.isClosed = false;
  graph.isOutline = true;
  graph.isWireframe = true;
  return graph;
};
