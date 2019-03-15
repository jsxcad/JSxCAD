const { isWatertightPolygons, makeWatertight } = require('@jsxcad/algorithm-watertight');
const poly3 = require('@jsxcad/math-poly3');

/**
 * Translates a polygon array [[[x, y, z], [x, y, z], ...]] to ascii STL.
 * The exterior side of a polygon is determined by a CCW point ordering.
 *
 * @param {Object} options.
 * @param {Polygon Array} polygons - An array of arrays of points.
 * @returns {String} - the ascii STL output.
 */

const polygonsToStla = (options = {}, polygons) => {
  if (!isWatertightPolygons(polygons)) {
    console.log(`polygonsToStla: Polygon is not watertight`);
    // polygons = makeWatertight(polygons);
  }
  return `solid JSxCAD\n${convertToFacets(options, polygons)}\nendsolid JSxCAD\n`;
};

const convertToFacets = (options, polygons) =>
  polygons.map(convertToFacet).join('\n');

const toStlVector = vector =>
  `${vector[0]} ${vector[1]} ${vector[2]}`;

const toStlVertex = vertex =>
  `vertex ${toStlVector(vertex)}`;

const convertToFacet = polygon => {
  let result = [];
  if (polygon.length >= 3) {
    // Build a poly3 for convenience in computing the normal.
    let normal = toStlVector(poly3.toPlane(polygon));
    // STL requires triangular polygons. If our polygon has more vertices, create multiple triangles:
    for (let i = 0; i < polygon.length - 2; i++) {
      result.push(
        [
          `facet normal ${normal}`,
          `outer loop`,
          `${toStlVertex(polygon[0])}`,
          `${toStlVertex(polygon[i + 1])}`,
          `${toStlVertex(polygon[i + 2])}`,
          `endloop`,
          `endfacet`
        ].join('\n'));
    }
  }
  return result.join('\n');
};

module.exports = polygonsToStla;
