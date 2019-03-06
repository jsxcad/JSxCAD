const canonicalize = require('./canonicalize');

/**
 * Passes each canonicalized point in the geometry in turn (in no particular
 *  order) to the provided function.
 * @params {Object} options.
 * @params {Function} thunk - the function to call.
 * @example
 * eachPoint(box)
 */
const eachPoint = (options, thunk, solid) => {
  for (const polygon of canonicalize(solid).polygons) {
    for (const vertex of polygon) {
      thunk(vertex);
    }
  }
};

module.exports = eachPoint;
