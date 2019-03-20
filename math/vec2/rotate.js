/**
 * Rotates a vec2 by an angle
 *
 * @param {Number} angle the angle of rotation (in radians)
 * @param {vec2} vector the vector to rotate
 * @returns {vec2} out
 */
export const rotate = (angle, [x, y]) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c - y * s,
          x * s + y * c];
};
