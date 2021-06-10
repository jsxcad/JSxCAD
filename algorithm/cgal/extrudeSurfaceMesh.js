import { checkSelfIntersection } from './doesSelfIntersectOfSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const extrudeSurfaceMesh = (mesh, transform, height, depth) =>
  checkSelfIntersection(
    getCgal().ExtrusionOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      height,
      depth
    )
  );
