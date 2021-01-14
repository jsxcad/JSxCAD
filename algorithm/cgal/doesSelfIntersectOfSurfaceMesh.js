import { getCgal } from './getCgal.js';

export const doesSelfIntersectOfSurfaceMesh = (mesh) => {
  try {
    return getCgal().DoesSelfIntersectOfSurfaceMesh(mesh);
  } catch (e) {
    if (typeof e === 'number') {
      // This otherwise uncaught exception indicates a self-intersection.
      return true;
    } else {
      throw e;
    }
  }
};

export const checkSelfIntersection = (mesh) => {
  if (doesSelfIntersectOfSurfaceMesh(mesh)) {
    throw Error('Self intersection');
  }
  return mesh;
};
