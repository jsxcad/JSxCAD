import { length } from './length.js';

/**
 * Calculates the unit vector of the given vector
 *
 * @param {vec3} vector - the base vector for calculations
 * @returns {vec3} unit vector of the given vector
 */
export const unit = (vector) => {
  const [x, y, z] = vector;
  const magnitude = length(vector);
  return [x / magnitude, y / magnitude, z / magnitude];
};
