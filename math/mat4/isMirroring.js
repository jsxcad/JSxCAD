import { cross, dot } from "@jsxcad/math-vec3";

/**
 * determine whether the input matrix is a mirroring transformation
 *
 * @param {mat4} mat the input matrix
 * @returns {boolean} output
 */
export const isMirroring = (mat) => {
  const u = [mat[0], mat[4], mat[8]];
  const v = [mat[1], mat[5], mat[9]];
  const w = [mat[2], mat[6], mat[10]];

  // for a true orthogonal, non-mirrored base, u.cross(v) == w
  // If they have an opposite direction then we are mirroring
  const mirrorvalue = dot(cross(u, v), w);
  const ismirror = mirrorvalue < 0;
  return ismirror;
};
