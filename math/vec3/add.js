/**
 * Adds two Points.
 *
 * @param {vec3} a the first vector to add
 * @param {vec3} b the second vector to add
 * @returns {vec3} the added vectors
 */
export const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];
