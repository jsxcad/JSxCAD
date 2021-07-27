import { taggedSegments } from '../tagged/taggedSegments.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { wireframeSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const wireframe = ({ tags }, geometry) => {
  geometry.cache = geometry.cache || {};
  if (geometry.cache.wireframe === undefined) {
    geometry.cache.wireframe = taggedSegments(
      { tags },
      wireframeSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix)
    );
  }
  return geometry.cache.wireframe;
};
