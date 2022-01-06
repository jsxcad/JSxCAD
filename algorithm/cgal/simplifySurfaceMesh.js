import { getCgal } from './getCgal.js';

export const simplifySurfaceMesh = (mesh, { stopRatio = 0.5, eps }) => {
  try {
    const result = getCgal().SimplifySurfaceMesh(
      mesh,
      stopRatio,
      eps !== undefined,
      eps || 0
    );
    result.provenance = 'simplify';
    return result;
  } catch (error) {
    throw Error(error);
  }
};
