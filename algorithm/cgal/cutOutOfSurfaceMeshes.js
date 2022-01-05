import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cutOutOfSurfaceMeshes = (a, aTransform, b, bTransform) => {
  try {
    let result;
    getCgal().CutOutOfSurfaceMeshes(
      a,
      toCgalTransformFromJsTransform(aTransform),
      b,
      toCgalTransformFromJsTransform(bTransform),
      (aNotB, aAndB) => {
        result = [aNotB, aAndB];
      }
    );
    return result;
  } catch (error) {
    throw Error(error);
  }
};
