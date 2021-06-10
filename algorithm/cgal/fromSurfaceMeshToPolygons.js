import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const fromSurfaceMeshToPolygons = (
  mesh,
  transform,
  triangulate = false
) => {
  const c = getCgal();
  const polygons = [];
  let polygon;
  c.FromSurfaceMeshToPolygonSoup(
    mesh,
    toCgalTransformFromJsTransform(transform),
    triangulate,
    () => {
      polygon = [];
      polygons.push(polygon);
    },
    (x, y, z) => polygon.push([x, y, z])
  );
  return polygons;
};
