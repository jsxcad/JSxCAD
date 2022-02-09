import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const generateUpperEnvelopeForSurfaceMesh = (mesh, transform) => {
  try {
    const result = getCgal().GenerateUpperEnvelopeForSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform)
    );
    result.provenance = 'generateUpperEnvelopeForSurfaceMesh';
    return result;
  } catch (error) {
    throw Error(error);
  }
};
