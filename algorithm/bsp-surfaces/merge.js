import { distance } from '@jsxcad/math-vec3';
import { findOpenEdges } from '@jsxcad/geometry-paths';
import { getEdges } from '@jsxcad/geometry-path';

// a and b are expected to have reconciled coordinates.

export const merge = (aPaths, bPaths) => {
  const aOpenEdges = findOpenEdges(aPaths);
  const aVertices = new Set();
  for (const [start, end] of aOpenEdges) {
    aVertices.add(start);
    aVertices.add(end);
  }

  const bOpenEdges = findOpenEdges(bPaths);
  const bVertices = new Set();
  for (const [start, end] of bOpenEdges) {
    bVertices.add(start);
    bVertices.add(end);
  }

  const repair = (paths, ownVertices, otherVertices) => {
    const repairedPaths = [];
    for (const path of paths) {
      const repairedPath = [];
      for (const [start, end] of getEdges(path)) {
        repairedPath.push(start);
        if (ownVertices.has(start) && ownVertices.has(end)) {
          // This is an open edge in a.
          const span = distance(start, end);
          const colinear = [];
          for (const vertex of otherVertices) {
            if (distance(start, vertex) + distance(vertex, end) === span) {
              // Vertex is on the open edge.
              colinear.push(vertex);
            }
          }
          // Arrange by distance from start.
          colinear.sort((a, b) => distance(start, a) - distance(start, b));
          // Insert into the path.
          repairedPath.push(...colinear);
        }
      }
      repairedPaths.push(repairedPath);
    }
    return repairedPaths;
  };

  return [...repair(aPaths, aVertices, bVertices), ...repair(bPaths, bVertices, aVertices)];
};
