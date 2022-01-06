import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const computeNormalOfSurfaceMesh = (
  mesh,
  transform,
  approximate,
  exact
) => {
  try {
    return getCgal().ComputeNormalOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      (ax, ay, az, ex, ey, ez) => {
        approximate.push(ax, ay, az);
        exact.push(ex, ey, ez);
      }
    );
  } catch (error) {
    throw Error(error);
  }
};
