import { getCgal } from './getCgal.js';

export const fromNefPolyhedronToSurfaceMesh = (nefPolyhedron) => {
  const c = getCgal();
  const mesh = c.FromNefPolyhedronToSurfaceMesh(nefPolyhedron);
  return mesh;
};
