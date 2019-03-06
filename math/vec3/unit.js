const length = require('./length');

/**
 * Calculates the unit vector of the given vector
 *
 * @param {vec3} vector - the base vector for calculations
 * @returns {vec3} unit vector of the given vector
 */
const unit = (vector) => {
  const magnitude = length(vector);
  return [vector[0] / magnitude,
          vector[1] / magnitude,
          vector[2] / magnitude];
};

module.exports = unit;
