import { sectionOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const section = (graph, planes) =>
  sectionOfSurfaceMesh(toSurfaceMesh(graph), planes);
