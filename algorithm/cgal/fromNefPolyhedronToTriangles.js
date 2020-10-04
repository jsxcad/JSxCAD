import { getCgal } from './getCgal.js';

export const fromNefPolyhedronToTriangles = (nef) => {
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
};
