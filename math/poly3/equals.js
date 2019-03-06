const plane = require('@jsxcad/math-plane');
const toPlane = require('./toPlane');
const vec3 = require('@jsxcad/math-vec3');

/**
 * Compare two polygons for equality
 * @param (poly3} poly1 - polygon with plane and vertices
 * @param (poly3} poly2 - polygon with plane and vertices
 * @returns {boolean} result of comparison
 */
const equals = (poly1, poly2) => {
  if (poly1.length !== poly2.length) {
    return false;
  }
  if (!plane.equals(toPlane(poly1), toPlane(poly2))) {
    return false;
  }
  for (let nth = 0; nth < poly1.length; nth++) {
    if (!vec3.equals(poly1[nth], poly2[nth])) {
      return false;
    }
  }
  return true;
};

module.exports = equals;
