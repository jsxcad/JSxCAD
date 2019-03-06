const toPointsOfPolygons = require('@jsxcad/algorithm-polygons').toPoints;
const toPolygons = require('./toPolygons');

/** Construct a Geom3 from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {Geom3} new Geom3 object
 */
const toPoints = (options = {}, solid) => toPointsOfPolygons({}, toPolygons({}, solid));

module.exports = toPoints;
