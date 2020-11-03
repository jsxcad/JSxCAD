import { getCgal } from './getCgal.js';

export const transformSurfaceMesh = (mesh, matrix) => {
  const [
    m00,
    m10,
    m20,
    ,
    m01,
    m11,
    m21,
    ,
    m02,
    m12,
    m22,
    ,
    m03,
    m13,
    m23,
    hw,
  ] = matrix;

  return getCgal().TransformSurfaceMesh(
    mesh,
    m00,
    m01,
    m02,
    m03,
    m10,
    m11,
    m12,
    m13,
    m20,
    m21,
    m22,
    m23,
    hw
  );
};
