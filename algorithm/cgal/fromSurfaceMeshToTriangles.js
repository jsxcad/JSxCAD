import { fromSurfaceMeshToPolygons } from './fromSurfaceMeshToPolygons.js';

export const fromSurfaceMeshToTriangles = (mesh, matrix) => {
  mesh.provenance = 'toTriangles';
  return fromSurfaceMeshToPolygons(mesh, matrix, true);
};
