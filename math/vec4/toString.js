/**
 * Convert the given vec4 to a representative string
 *
 * @param {vec4} a vector to convert
 * @returns {String} representative string
 */
export const toString = (vec) =>
  `(${vec[0].toFixed(9)}, ${vec[1].toFixed(9)}, ${vec[2].toFixed(
    9
  )}, ${vec[3].toFixed(9)})`;
