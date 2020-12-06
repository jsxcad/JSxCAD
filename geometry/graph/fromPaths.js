import {
  addFace,
  addHoleFromPoints,
  addLoopFromPoints,
  create,
} from './graph.js';

import { deduplicate, flip, isClockwise } from '@jsxcad/geometry-path';

import { arrangePaths } from '@jsxcad/algorithm-cgal';

const orientClockwise = (path) => (isClockwise(path) ? path : flip(path));
const orientCounterClockwise = (path) =>
  isClockwise(path) ? flip(path) : path;

export const fromPaths = (paths) => {
  // FIX: Discover the plane for planar graphs.
  const plane = [0, 0, 1, 0];
  const arrangement = arrangePaths(...plane, paths);
  const graph = create();
  for (const { points, holes } of arrangement) {
    const face = addFace(graph, { plane });
    const exterior = orientCounterClockwise(points);
    addLoopFromPoints(graph, deduplicate(exterior), { face });
    for (const hole of holes) {
      const interior = orientClockwise(hole);
      addHoleFromPoints(graph, deduplicate(interior), { face });
    }
  }
  graph.isClosed = false;
  graph.isOutline = true;
  graph.isWireframe = true;
  return graph;
};
