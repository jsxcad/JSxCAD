import { arrangePaths, fitPlaneToPoints } from '@jsxcad/algorithm-cgal';
import { deduplicate, flip, isClockwise } from '@jsxcad/geometry-path';

import { canonicalize as canonicalizePaths } from '@jsxcad/geometry-paths';
import { dot } from '@jsxcad/math-vec3';
import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';

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
  const orientedPolygonsWithHoles = [];
  let plane = fitPlaneToPoints(points);
  if (plane) {
    // Orient planes up by default.
    // FIX: Remove this hack.
    if (dot(plane, [0, 0, 1, 0]) < -0.1) {
      plane[Z] *= -1;
    }
    for (const { points, holes } of arrangePaths(
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
      const orientedPolygonWithHoles = { points: cleaned, holes: [], plane };
      for (const { points } of holes) {
        const interior = orientClockwise(points);
        const cleaned = clean(interior);
        if (cleaned.length < 3) {
          continue;
        }
        orientedPolygonWithHoles.holes.push({ points: cleaned });
      }
      orientedPolygonsWithHoles.push(orientedPolygonWithHoles);
    }
  }
  const graph = fromPolygonsWithHoles(orientedPolygonsWithHoles);
  if (graph.edges.length === 0) {
    graph.isEmpty = true;
  }
  graph.isClosed = false;
  graph.isOutline = true;
  graph.isWireframe = true;
  return graph;
};
