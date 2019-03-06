/**
 * Return a string representing the given line.
 *
 * @param {line2} line the 2D line of reference
 * @returns {string} string representation
 */
const toString = (line) => `line2: (${line[0].toFixed(7)}, ${line[1].toFixed(7)}, ${line[2].toFixed(7)})`;

module.exports = toString;
