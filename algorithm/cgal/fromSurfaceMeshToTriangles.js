import { fromSurfaceMeshToPolygons } from './fromSurfaceMeshToPolygons.js';

export const fromSurfaceMeshToTriangles = (mesh) =>
  fromSurfaceMeshToPolygons(mesh, true);
