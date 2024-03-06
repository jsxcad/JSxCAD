import { getCgal } from './getCgal.js';

export const smoothSurfaceMesh = (
  mesh,
  matrix,
  { iterations = 1, safe = true },
  selections
) => {
  try {
    const smoothedMesh = getCgal().SmoothSurfaceMesh(
      mesh,
      matrix,
      iterations,
      safe,
      selections.length,
      (nth) => selections[nth].mesh,
      (nth) => selections[nth].matrix
    );
    smoothedMesh.provenance = 'smooth';
    return smoothedMesh;
  } catch (error) {
    throw Error(error);
  }
};
