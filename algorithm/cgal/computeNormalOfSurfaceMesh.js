import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const computeNormalOfSurfaceMesh = (
  mesh,
  transform,
  approximate,
  exact
) =>
  getCgal().ComputeNormalOfSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    (ax, ay, az, ex, ey, ez) => {
      approximate.push(ax, ay, az);
      exact.push(ex, ey, ez);
    }
  );
