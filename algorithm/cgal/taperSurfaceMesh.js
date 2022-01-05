import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const taperSurfaceMesh = (
  mesh,
  transform,
  xPlusFactor,
  xMinusFactor,
  yPlusFactor,
  yMinusFactor
) => {
  try {
    getCgal().TaperSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      xPlusFactor,
      xMinusFactor,
      yPlusFactor,
      yMinusFactor
    );
  } catch (error) {
    throw Error(error);
  }
};
