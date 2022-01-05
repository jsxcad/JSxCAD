import { getCgal } from './getCgal.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { toCgalTransformFromJsTransform } from './transform.js';

export const fromSurfaceMeshToPolygons = (
  mesh,
  transform = identityMatrix,
  triangulate = false
) => {
  try {
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
  } catch (error) {
    throw Error(error);
  }
};
