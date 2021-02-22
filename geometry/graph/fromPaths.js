import { deduplicate, flip, isClockwise } from '@jsxcad/geometry-path';

import { arrangePaths } from '@jsxcad/algorithm-cgal';
import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { realizeGraph } from './realizeGraph.js';

const clean = (path) => deduplicate(path);

const orientCounterClockwise = (path) =>
  isClockwise(path) ? flip(path) : path;

// This imposes a planar arrangement.
export const fromPaths = (paths, plane = [0, 0, 1, 0]) => {
  const orientedPolygons = [];
  for (const { points } of arrangePaths(
    plane,
    undefined,
    paths,
    /* triangulate= */ true
  )) {
    const exterior = orientCounterClockwise(points);
    const cleaned = clean(exterior);
    if (cleaned.length < 3) {
      continue;
    }
    const orientedPolygon = { points: cleaned, plane };
    orientedPolygons.push(orientedPolygon);
  }
  // Note: These cannot have holes due to 'triangulate' above.
  const graph = realizeGraph(fromPolygonsWithHoles(orientedPolygons));
  if (graph.edges.length === 0) {
    graph.isEmpty = true;
  }
  graph.isClosed = false;
  graph.isOutline = true;
  graph.isWireframe = true;
  return graph;
};
