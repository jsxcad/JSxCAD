import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { distance } from '@jsxcad/math-vec3';
import { getEdges } from '@jsxcad/geometry-path';

const THRESHOLD = 1e-5;

// We expect a solid of reconciled triangles.

const watertight = Symbol('watertight');

export const makeWatertight = (solid, normalize = createNormalize3(), onFixed = (_ => _)) => {
  if (!solid[watertight]) {
    let fixed = false;
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

    const watertightSolid = [];
    for (const surface of reconciledSolid) {
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
              if (vertex !== start && vertex !== end) {
                // FIX: Clip an ear instead.
                // Vertex is on the open edge.
                colinear.push(vertex);
                fixed = true;
              }
            }
          }
          // Arrange by distance from start.
          colinear.sort((a, b) => distance(start, a) - distance(start, b));
          // Insert into the path.
          watertightPath.push(...colinear);
        }
        watertightPaths.push(watertightPath);
      }
      watertightSolid.push(watertightPaths);
    };

    // At this point we should have the correct structure for assembly into a solid.
    // We just need to ensure triangulation to support deformation.

    onFixed(fixed);

    solid[watertight] = watertightSolid;
  }

  return solid[watertight];
};

export const isWatertight = (solid) => {
  const edges = new Set();
  for (const surface of solid) {
    for (const path of surface) {
      for (const [start, end] of getEdges(path)) {
        edges.add(`${JSON.stringify([start, end])}`);
      }
    }
  }
  for (const surface of solid) {
    for (const path of surface) {
      for (const [start, end] of getEdges(path)) {
        if (!edges.has(`${JSON.stringify([end, start])}`)) {
          return false;
        }
      }
    }
  }
  return true;
};
