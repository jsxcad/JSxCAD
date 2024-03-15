import { getCgal } from './getCgal.js';

export const pushSurfaceMesh = (
  mesh,
  transform,
  force,
  minimumDistance,
  scale = 1
) => {
  try {
    getCgal().PushSurfaceMesh(
      mesh,
      transform,
      Number(force),
      Number(minimumDistance),
      Number(scale)
    );
  } catch (error) {
    throw Error(error);
  }
};
