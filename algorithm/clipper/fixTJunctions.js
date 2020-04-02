import { RESOLUTION } from './convert';
import { distance } from '@jsxcad/math-vec3';
import { getEdges } from '@jsxcad/geometry-path';
import { pushWhenValid } from '@jsxcad/geometry-polygons';

const THRESHOLD = 1e-5 * RESOLUTION;

// We expect a surface of reconciled triangles.

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
