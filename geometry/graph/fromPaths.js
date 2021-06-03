import {
  arrangePathsIntoTriangles,
  fromPolygonsToSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { deduplicate } from '../path/deduplicate.js';
import { flip } from '../path/flip.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { isClockwise } from '../path/isClockwise.js';

const clean = (path) => deduplicate(path);

const orientCounterClockwise = (path) =>
  isClockwise(path) ? flip(path) : path;

// This imposes a planar arrangement.
export const fromPaths = (paths, plane = [0, 0, 1, 0]) => {
  if (plane[0] === 0 && plane[1] === 0 && plane[2] === 0 && plane[3] === 0) {
    throw Error(`Zero plane`);
  }
  const orientedPolygons = [];
  for (const { points } of arrangePathsIntoTriangles(plane, undefined, paths)) {
    const exterior = orientCounterClockwise(points);
    const cleaned = clean(exterior);
    if (cleaned.length < 3) {
      continue;
    }
    const orientedPolygon = { points: cleaned, plane };
    orientedPolygons.push(orientedPolygon);
  }
  return fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(orientedPolygons));
};
