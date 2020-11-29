import { getCgal } from './getCgal.js';

export const fromSurfaceMeshToNefPolyhedron = (surfaceMesh) => {
  const c = getCgal();
  if (!surfaceMesh.is_valid(false)) {
    surfaceMesh.is_valid(true);
    throw Error('not valid');
  }
  if (!c.Surface_mesh__is_closed(surfaceMesh)) {
    throw Error('not closed');
  }
  if (!c.Surface_mesh__is_valid_halfedge_graph(surfaceMesh)) {
    throw Error('not valid_halfedge_graph');
  }
  if (!c.Surface_mesh__is_valid_face_graph(surfaceMesh)) {
    throw Error('not valid_face_graph');
  }
  if (!c.Surface_mesh__is_valid_polygon_mesh(surfaceMesh)) {
    throw Error('not valid_polygon_mesh');
  }
  const nefPolyhedron = c.FromSurfaceMeshToNefPolyhedron(surfaceMesh);
  if (!nefPolyhedron.is_valid(false, 1)) {
    throw Error('not valid');
  }
  return nefPolyhedron;
};
