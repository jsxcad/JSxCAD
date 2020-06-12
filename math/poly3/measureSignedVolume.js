import { cross, dot } from "@jsxcad/math-vec3";

/*
 * Measure the signed volume of the given polygon, which must be convex.
 * The volume is that formed by the tetrahedon connected to the axis,
 * and will be positive or negative based on the rotation of the vertices.
 * See http://chenlab.ece.cornell.edu/Publication/Cha/icip01_Cha.pdf
 */
export const measureSignedVolume = (poly3) => {
  let signedVolume = 0;
  const vertices = poly3;
  // calculate based on triangluar polygons
  for (let i = 0; i < vertices.length - 2; i++) {
    signedVolume += dot(vertices[0], cross(vertices[i + 1], vertices[i + 2]));
  }
  signedVolume /= 6;
  return signedVolume;
};
