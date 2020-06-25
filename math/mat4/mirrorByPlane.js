/**
 * Create an affine matrix for mirroring onto an arbitrary plane
 *
 * @param {vec4} plane to mirror the matrix by
 * @returns {mat4} out
 */
export const mirrorByPlane = ([nx, ny, nz, w]) => [
  1.0 - 2.0 * nx * nx,
  -2.0 * ny * nx,
  -2.0 * nz * nx,
  0,
  -2.0 * nx * ny,
  1.0 - 2.0 * ny * ny,
  -2.0 * nz * ny,
  0,
  -2.0 * nx * nz,
  -2.0 * ny * nz,
  1.0 - 2.0 * nz * nz,
  0,
  2.0 * nx * w,
  2.0 * ny * w,
  2.0 * nz * w,
  1,
];
