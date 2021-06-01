import { info } from '@jsxcad/sys';
import { outlineSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) => {
  info('outline begin');
  const result = outlineSurfaceMesh(toSurfaceMesh(graph));
  info('outline end');
  return result;
};
