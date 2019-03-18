import { negate, normal } from '@jsxcad/math-vec2';

/**
 * Return the direction of the given line.
 *
 * @return {vec2} a new relative vector in the direction of the line
 */
export const direction = (line) => negate(normal(line));
