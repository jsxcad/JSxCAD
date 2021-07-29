import { info } from '@jsxcad/sys';
import { outlineSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedSegments } from '../tagged/taggedSegments.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = ({ tags }, geometry) => {
  geometry.cache = geometry.cache || {};
  if (geometry.cache.outline === undefined) {
    info('outline begin');
    geometry.cache.outline = taggedSegments(
      { tags },
      outlineSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix)
    );
    info('outline end');
  } else {
    info('outline cached');
  }
  return geometry.cache.outline;
};
