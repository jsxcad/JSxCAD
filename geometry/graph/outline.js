import { info } from '@jsxcad/sys';
import { outlineSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (geometry) => {
  geometry.cache = geometry.cache || {};
  if (geometry.cache.outline === undefined) {
    info('outline begin');
    geometry.cache.outline = outlineSurfaceMesh(
      toSurfaceMesh(geometry.graph),
      geometry.matrix
    );
    info('outline end');
  }
  return geometry.cache.outline;
};
