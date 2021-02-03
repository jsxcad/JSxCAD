import { getCgal } from './getCgal.js';

// Set this to true to throw an exception on self intersection.
const CHECK_SELF_INTERSECTION = false;

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
  if (CHECK_SELF_INTERSECTION && doesSelfIntersectOfSurfaceMesh(mesh)) {
    throw Error('Self intersection');
  }
  return mesh;
};
