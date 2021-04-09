// import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';
// export const outline = (graph) => toPolygonsWithHoles(graph);

import { outlineSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) => outlineSurfaceMesh(toSurfaceMesh(graph));
