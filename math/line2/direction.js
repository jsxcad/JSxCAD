const vec2 = require('@jsxcad/math-vec2');

/**
 * Return the direction of the given line.
 *
 * @return {vec2} a new relative vector in the direction of the line
 */
const direction = (line) => vec2.negate(vec2.normal(line));

module.exports = direction;
