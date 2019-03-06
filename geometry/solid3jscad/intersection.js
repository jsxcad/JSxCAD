const CSG = require('./src/CSG');
const Polygon = require('./src/math/Polygon3');
const Vertex = require('./src/math/Vertex3');
const Vector3D = require('./src/math/Vector3');
const toPolygons = require('./toPolygons');
const fromPolygons = require('./fromPolygons');

const toOldPoly = (polygon) => new Polygon(polygon.map(point => new Vertex(new Vector3D(point[0], point[1], point[2]),
                                                                           new Vector3D(0, 0, 0))));
const fromOldPoly = (polygon) => polygon.vertices.map(vertex => [vertex.pos.x, vertex.pos.y, vertex.pos.z]);

/**
   * Return a new Geom3 solid representing space in both this solid and
   * in the given solids.
   * Immutable: Neither this solid nor the given solids are modified.
   * @param {Geom3[]} geometry - list of Geom3 objects
   * @returns {Geom3} new Geom3 object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const intersection = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPolygons([]);
    case 1: return geometries[0];
    default: {
      const csgs = geometries.map(geometry => CSG.fromPolygons(toPolygons({}, geometry).map(toOldPoly)));
      let a = csgs.shift();
      while (csgs.length > 0) {
        const b = csgs.shift();
        a = a.intersect(b);
      }
      return fromPolygons({}, a.toPolygons().map(fromOldPoly));
    }
  }
};

module.exports = intersection;
