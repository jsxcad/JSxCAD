import { equals as equalsVec2 } from "@jsxcad/math-vec2";

const EPS = 1e-5;
const W = 2;

/**
 * Compare the given 2D lines for equality
 *
 * @return {boolean} true if lines are equal
 */
export const equals = (line1, line2) => {
  if (!equalsVec2(line1, line2)) {
    return false;
  }
  if (Math.abs(line1[W] - line2[W]) > EPS) {
    return false;
  }
  return true;
};
