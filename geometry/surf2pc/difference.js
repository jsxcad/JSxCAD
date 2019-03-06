const canonicalize = require('./canonicalize');
const fromPolygons = require('./fromPolygons');
const polygonClippingDifference = require('polygon-clipping').difference;

/**
 * Return a surface representing the difference between the first surface
 *   and the rest of the surfaces.
 * The difference of no surfaces is the empty surface.
 * The difference of one surface is that surface.
 * @param {Array<surface>} surfaces - the surfaces.
 * @returns {surface} - the resulting surface
 * @example
 * let C = difference(A, B)
 * @example
 * +-------+            +-------+
 * |       |            |   C   |
 * |   A   |            |       |
 * |    +--+----+   =   |    +--+
 * +----+--+    |       +----+
 *      |   B   |
 *      |       |
 *      +-------+
 */
const difference = (...surfaces) => {
  switch (surfaces.length) {
    case 0:
      return fromPolygons({}, []);
    case 1:
      return surfaces[0];
    default:
      const combined = surfaces.map(surface =>
        canonicalize(surface).polygons.map(polygon => polygon.map(([a, b]) => [a, b])));
      const differenced = polygonClippingDifference(...combined);
      // The paths return express circularity by duplicating the first element
      // at the end.
      for (const polygons of differenced) {
        for (const polygon of polygons) {
          polygon.pop();
        }
      }
      return fromPolygons({}, [].concat(...differenced));
  }
};

module.exports = difference;
