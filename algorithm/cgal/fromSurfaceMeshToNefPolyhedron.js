import { getCgal } from './getCgal.js';

export const fromSurfaceMeshToNefPolyhedron = (surfaceMesh) => {
  const c = getCgal();
  const nefPolyhedron = c.FromSurfaceMeshToNefPolyhedron(surfaceMesh);
  return nefPolyhedron;
};
