import { getCgal } from './getCgal.js';

export const fromNefPolyhedronToTriangles = (nef) => {
  /*
  const c = getCgal();
  const triangles = [];
  c.FromNefPolyhedronToTriangles(nef, (aX, aY, aZ, bX, bY, bZ, cX, cY, cZ) =>
    triangles.push([
      [aX, aY, aZ],
      [bX, bY, bZ],
      [cX, cY, cZ],
    ])
  );
  return triangles;
*/
  const c = getCgal();
  const triangles = [];
  let triangle;
  c.FromNefPolyhedronToPolygons(
    nef,
    true,
    (x, y, z) => triangles.push([x, y, z]),
    () => {
      triangle = [];
      triangles.push(triangle);
    }
  );
  return triangles;
};
