import { fromPolygonsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';

export const fromTriangles = (triangles) =>
  fromSurfaceMeshLazy(fromPolygonsToSurfaceMesh(triangles));
