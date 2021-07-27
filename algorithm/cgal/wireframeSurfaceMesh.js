import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const wireframeSurfaceMesh = (mesh, transform) => {
  const segments = [];
  getCgal().WireframeSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    (sx, sy, sz, tx, ty, tz) =>
      segments.push([
        [sx, sy, sz],
        [tx, ty, tz],
      ])
  );
  return segments;
};
