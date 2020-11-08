import { max, min } from '@jsxcad/math-vec3';

import { fromSurfaceMeshEmitBoundingBox } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const measureBoundingBox = (graph) => {
  if (graph.boundingBox === undefined) {
    if (graph.isLazy) {
      fromSurfaceMeshEmitBoundingBox(
        toSurfaceMesh(graph),
        (xMin, yMin, zMin, xMax, yMax, zMax) => {
          graph.boundingBox = [
            [xMin, yMin, zMin],
            [xMax, yMax, zMax],
          ];
        }
      );
    } else {
      let minPoint = [Infinity, Infinity, Infinity];
      let maxPoint = [-Infinity, -Infinity, -Infinity];
      if (graph.points) {
        for (const point of graph.points) {
          if (point !== undefined) {
            minPoint = min(minPoint, point);
            maxPoint = max(maxPoint, point);
          }
        }
      }
      graph.boundingBox = [minPoint, maxPoint];
    }
  }
  return graph.boundingBox;
};
