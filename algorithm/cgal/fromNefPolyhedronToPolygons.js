import { getCgal } from './getCgal.js';

export const fromNefPolyhedronToPolygons = (nef) => {
  const c = getCgal();
  const polygons = [];
  let polygon;
  c.FromNefPolyhedronToPolygons(
    nef,
    false,
    (x, y, z) => polygon.push([x, y, z]),
    () => {
      polygon = [];
      polygons.push(polygon);
    }
  );
  return polygons;
};
