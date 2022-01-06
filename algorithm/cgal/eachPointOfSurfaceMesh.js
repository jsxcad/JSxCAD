import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const eachPointOfSurfaceMesh = (mesh, matrix, emit) => {
  try {
    getCgal().EachPointOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      (x, y, z, exactX, exactY, exactZ) =>
        emit([x, y, z, exactX, exactY, exactZ])
    );
  } catch (error) {
    throw Error(error);
  }
};
