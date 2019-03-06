const poly3 = require('@jsxcad/math-poly3');

/**
 * Performs an in-place canoncalization of the solid.
 * After canonicalization solid.polygons contains polygons retessellated
 *   polygons with transformed quantized points.
 * @params {solid} solid - the solid to canonicalize.
 * @returns {solid}
 * @example
 * let rawGeometry = someGeometryMakingFunction()
 * let canonicalizedGeom = canonicalize(rawGeometry)
 */
const canonicalize = (solid) => {
  if (!solid.isCanonicalized) {
    solid.polygons = solid.basePolygons.map(
      polygon => poly3.transform(solid.transforms, polygon));
    solid.isCanonicalized = true;
  }
  return solid;
};

module.exports = canonicalize;
