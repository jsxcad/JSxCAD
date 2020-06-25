/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
export const length = ([x = 0, y = 0, z = 0]) =>
  Math.sqrt(x * x + y * y + z * z);
