import { canonicalize as canonicalizeVec3 } from "@jsxcad/math-vec3";

export const canonicalize = (points) => points.map(canonicalizeVec3);
