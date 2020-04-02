import { distance, squaredDistance } from '@jsxcad/math-vec3';

// import { RESOLUTION } from './convert';
import { fromPolygon } from '@jsxcad/math-plane';
import { getEdges } from '@jsxcad/geometry-path';

const THRESHOLD = 1e-5; // * RESOLUTION;
const EPSILON2 = THRESHOLD * THRESHOLD;

export const pushWhenValid = (out, points, expectedPlane) => {
  const validated = [];
  const l = points.length;
  for (let i = 0; i < l; i++) {
    if (squaredDistance(points[i], points[(i + 1) % l]) > EPSILON2) {
      validated.push(points[i]);
    }
  }
  if (validated.length < 3) {
    return;
  }
  const plane = fromPolygon(validated);
  if (plane === undefined) {
    return;
  }
  if (expectedPlane !== undefined) {
    validated.plane = expectedPlane;
  }
  out.push(validated);
};

export const fixTJunctions = (surface) => {
  const vertices = new Set();

  for (const path of surface) {
    for (const point of path) {
      vertices.add(point);
    }
  }

  const watertightPaths = [];
  for (const path of surface) {
    const watertightPath = [];
    for (const [start, end] of getEdges(path)) {
      watertightPath.push(start);
      const span = distance(start, end);
      const colinear = [];
      for (const vertex of vertices) {
        // FIX: Threshold
        if (Math.abs(distance(start, vertex) + distance(vertex, end) - span) < THRESHOLD) {
          // FIX: Clip an ear instead.
          // Vertex is on the open edge.
          colinear.push(vertex);
        }
      }
      // Arrange by distance from start.
      colinear.sort((a, b) => distance(start, a) - distance(start, b));
      // Insert into the path.
      watertightPath.push(...colinear);
    }
    pushWhenValid(watertightPaths, watertightPath);
  }

  return watertightPaths;
};
