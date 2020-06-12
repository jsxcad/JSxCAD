import {
  fromValues as fromValuesAVec3,
  max as maxOfVec3,
  min as minOfVec3,
} from "@jsxcad/math-vec3";

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (poly3) => {
  const cached = poly3.boundingBox;
  if (cached === undefined) {
    const vertices = poly3;
    const numvertices = vertices.length;
    let min = numvertices === 0 ? fromValuesAVec3() : vertices[0];
    let max = min;
    for (let i = 1; i < numvertices; i++) {
      min = minOfVec3(min, vertices[i]);
      max = maxOfVec3(max, vertices[i]);
    }
    poly3.boundingBox = [min, max];
    return poly3.boundingBox;
  }
  return cached;
};
