import { canonicalize as canonicalizeOfVec3 } from "@jsxcad/math-vec3";

const canonicalizePoint = (point, index) => {
  if (point === null) {
    if (index !== 0) throw Error("Path has null not at head");
    return point;
  } else {
    return canonicalizeOfVec3(point);
  }
};

export const canonicalize = (path) => path.map(canonicalizePoint);
