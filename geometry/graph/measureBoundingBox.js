import { fromSurfaceMeshEmitBoundingBox } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const measureBoundingBox = (geometry) => {
  if (
    geometry.cache === undefined ||
    geometry.cache.boundingBox === undefined
  ) {
    if (geometry.cache === undefined) {
      geometry.cache = {};
    }
    const { graph } = geometry;
    if (graph.isEmpty) {
      return [
        [Infinity, Infinity, Infinity],
        [-Infinity, -Infinity, -Infinity],
      ];
    }
    fromSurfaceMeshEmitBoundingBox(
      toSurfaceMesh(graph),
      geometry.matrix,
      (xMin, yMin, zMin, xMax, yMax, zMax) => {
        geometry.cache.boundingBox = [
          [xMin, yMin, zMin],
          [xMax, yMax, zMax],
        ];
      }
    );
  }
  return geometry.cache.boundingBox;
};
