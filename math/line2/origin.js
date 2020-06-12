import { scale } from "@jsxcad/math-vec2";

/**
 * Return the origin of the given line.
 *
 * @param {line2} line the 2D line of reference
 * @return {vec2} the origin of the line
 */
const W = 2;

export const origin = (line) => scale(line[W], line);
