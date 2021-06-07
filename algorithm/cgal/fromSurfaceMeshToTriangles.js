import { fromSurfaceMeshToPolygons } from './fromSurfaceMeshToPolygons.js';

export const fromSurfaceMeshToTriangles = (mesh, matrix) =>
  fromSurfaceMeshToPolygons(mesh, matrix, true);
