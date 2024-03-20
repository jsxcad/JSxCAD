import { getCgal } from './getCgal.js';

export const minkowskiSumOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) => {
  try {
    getCgal().MinkowskiSumOfSurfaceMeshes(
      mesh,
      meshTransform,
      Number(offset),
      offsetTransform
    );
  } catch (error) {
    throw Error(error);
  }
};
