const create = require('./create');

/** Construct a Geom3 from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {Geom3} new Geom3 object
 */
const fromPolygons = (options = {}, polygons) => {
  let created = create();
  // Do we need to ensure that the polygons are convex?
  created.basePolygons = polygons;
  created.isCanonicalized = false;
  created.isRetessellated = true;
  return created;
};

module.exports = fromPolygons;
