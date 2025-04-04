import { getCgal } from './getCgal.js';

export const minkowskiDifferenceOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) => {
  try {
    getCgal().MinkowskiDifferenceOfSurfaceMeshes(
      mesh,
      meshTransform,
      Number(offset),
      offsetTransform
    );
  } catch (error) {
    throw Error(error);
  }
};
