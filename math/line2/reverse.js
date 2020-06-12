import { fromValues } from "./fromValues";
import { negate } from "@jsxcad/math-vec2";

// TODO: Call this flip?
/**
 * Create a new line in the opposite direction as the given.
 *
 * @param {line2} line the 2D line to reverse
 * @returns {line2} a new unbounded 2D line
 */
export const reverse = (line) => {
  const normal = negate(line);
  const distance = -line[2];
  return fromValues(normal[0], normal[1], distance);
};
