import {
  addFace,
  addHoleFromPoints,
  addLoopFromPoints,
  create,
} from './graph.js';

import { deduplicate, flip, isClockwise } from '@jsxcad/geometry-path';

import { arrangePaths } from '@jsxcad/algorithm-cgal';
import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';

const orientClockwise = (path) => (isClockwise(path) ? path : flip(path));
const orientCounterClockwise = (path) =>
  isClockwise(path) ? flip(path) : path;

const Z = 2;
const W = 3;

export const fromPaths = (inputPaths) => {
  const paths = canonicalizePaths(inputPaths);
  const graph = create();
  let plane = [0, 0, 1, 0];
  let updated = false;
  // FIX: Figure out a better way to get a principle plane.
  // Pick some point elevation.
  for (const path of paths) {
    for (const point of path) {
      if (point === null) {
        continue;
      }
      plane[W] = point[Z];
      updated = true;
      break;
    }
    if (updated) {
      break;
    }
  }
  if (plane) {
    const arrangement = arrangePaths(...plane, paths);
    for (const { points, holes } of arrangement) {
      const face = addFace(graph, { plane });
      const exterior = orientCounterClockwise(points);
      addLoopFromPoints(graph, deduplicate(exterior), { face });
      for (const hole of holes) {
        const interior = orientClockwise(hole);
        addHoleFromPoints(graph, deduplicate(interior), { face });
      }
    }
  }
  if (graph.edges.length === 0) {
    graph.isEmpty = true;
  }
  graph.isClosed = false;
  graph.isOutline = true;
  graph.isWireframe = true;
  return graph;
};
