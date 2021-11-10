import { outlineSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedSegments } from '../tagged/taggedSegments.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = ({ tags }, geometry) => {
  geometry.cache = geometry.cache || {};
  if (geometry.cache.outline === undefined) {
    const segments = [];
    outlineSurfaceMesh(
      toSurfaceMesh(geometry.graph),
      geometry.matrix,
      (segment) => segments.push(segment)
    );
    geometry.cache.outline = taggedSegments({ tags }, segments);
  }
  return geometry.cache.outline;
};
