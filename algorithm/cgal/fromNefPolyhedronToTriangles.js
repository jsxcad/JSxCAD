import { getCgal } from './getCgal.js';

export const fromNefPolyhedronToTriangles = (nef) => {
  const c = getCgal();
  const triangles = [];
  let triangle;
  c.FromNefPolyhedronToPolygons(
    nef,
    true,
    (x, y, z) => triangle.push([x, y, z]),
    () => {
      triangle = [];
      triangles.push(triangle);
    }
  );
  return triangles;
};
