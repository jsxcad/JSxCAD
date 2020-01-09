import { distance } from '@jsxcad/math-vec3';
import { getEdges } from '@jsxcad/geometry-path';

// We expect a solid of reconciled triangles.

export const fix = (solid, normalize) => {
  const vertices = new Set();

  const reconciledSolid = [];
  for (const surface of solid) {
    const reconciledSurface = [];
    for (const path of surface) {
      const reconciledPath = [];
      for (const point of path) {
        const reconciledPoint = normalize(point);
        reconciledPath.push(reconciledPoint);
        vertices.add(reconciledPoint);
      }
      reconciledSurface.push(reconciledPath);
    }
    reconciledSolid.push(reconciledSurface);
  }

  const repairedSolid = [];
  for (const surface of solid) {
    const repairedPaths = [];
    for (const path of surface) {
      const repairedPath = [];
      for (const [start, end] of getEdges(path)) {
        repairedPath.push(start);
        const span = distance(start, end);
        const colinear = [];
        for (const vertex of vertices) {
          // FIX: Threshold
          if (Math.abs(distance(start, vertex) + distance(vertex, end) - span) < 0.001) {
            // FIX: Clip an ear instead.
            // Vertex is on the open edge.
            colinear.push(vertex);
          }
        }
        // Arrange by distance from start.
        colinear.sort((a, b) => distance(start, a) - distance(start, b));
        // Insert into the path.
        repairedPath.push(...colinear);
      }
      repairedPaths.push(repairedPath);
    }
    repairedSolid.push(repairedPaths);
  };

  // At this point we should have the correct structure for assembly into a solid.
  // We just need to ensure convexity.

  return repairedSolid;

  // const convex = repairedSolid.map(surface => makeConvex(surface, normalize));
  // return convex;
};
