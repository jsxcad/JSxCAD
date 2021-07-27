import { fromSurfaceMeshToTriangles } from '@jsxcad/algorithm-cgal';
import { taggedTriangles } from '../tagged/taggedTriangles.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

Error.stackTraceLimit = Infinity;

export const toTriangles = ({ tags }, geometry) => {
  geometry.cache = geometry.cache || {};
  if (!geometry.cache.triangles) {
    const { matrix, graph } = geometry;
    const triangles = taggedTriangles(
      { tags },
      fromSurfaceMeshToTriangles(toSurfaceMesh(graph), matrix)
    );
    geometry.cache.triangles = triangles;
  }
  return geometry.cache.triangles;
};
