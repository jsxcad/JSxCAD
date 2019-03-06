const bsp = require('@jsxcad/algorithm-bsp');
const canonicalize = require('./canonicalize');
const fromPolygons = require('./fromPolygons');

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
    case 0: return fromPolygons({}, []);
    case 1: return geometries[0];
    default: {
      let baseGeometry = geometries[0];
      for (let i = 1; i < geometries.length; i++) {
        const intersectGeometry = geometries[i];

        const baseBsp = bsp.fromPolygons({}, canonicalize(baseGeometry).polygons);
        const intersectBsp = bsp.fromPolygons({}, canonicalize(intersectGeometry).polygons);

        bsp.invert(baseBsp);
        bsp.clipTo(intersectBsp, baseBsp);

        bsp.invert(intersectBsp);
        bsp.clipTo(baseBsp, intersectBsp);
        bsp.clipTo(intersectBsp, baseBsp);
        bsp.build(baseBsp, bsp.toPolygons({}, intersectBsp));

        bsp.invert(baseBsp);

        baseGeometry = fromPolygons({}, bsp.toPolygons({}, baseBsp));
      }
      return baseGeometry;
    }
  }
};

module.exports = intersection;
