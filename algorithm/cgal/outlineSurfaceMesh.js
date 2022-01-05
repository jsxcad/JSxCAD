import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const outlineSurfaceMesh = (mesh, transform, emit) => {
  try {
    getCgal().OutlineSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      (sx, sy, sz, tx, ty, tz, nx, ny, nz) =>
        emit(
          [
            [sx, sy, sz],
            [tx, ty, tz],
          ],
          [
            [0, 0, 0],
            [nx, ny, nz],
          ]
        )
    );
  } catch (error) {
    throw Error(error);
  }
};
