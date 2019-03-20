/**
 * Normalize the given vector.
 *
 * @param {vec2} a vector to normalize
 * @returns {vec2} normalized (unit) vector
 */
export const normalize = ([x, y]) => {
  let len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    return [x * len, y * len];
  } else {
    return [x, y];
  }
};
