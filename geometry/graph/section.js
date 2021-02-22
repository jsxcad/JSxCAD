import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (graph, planes) =>
  fromPolygonsWithHoles(sectionOfSurfaceMesh(toSurfaceMesh(graph), planes));
