import { getCgal } from './getCgal.js';

export const fromSurfaceMeshToPolygons = (mesh, triangulate = false) => {
  const c = getCgal();
  const polygons = [];
  let polygon;
  c.FromSurfaceMeshToPolygonSoup(
    mesh,
    triangulate,
    () => {
      polygon = [];
      polygons.push(polygon);
    },
    (x, y, z) => polygon.push([x, y, z])
  );
  return polygons;
};
