const bsp = require('@jsxcad/algorithm-bsp');
const fromPolygons = require('./fromPolygons');
const toPolygons = require('./toPolygons');

/**
   * Return a new geom3 representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {geom3[]} csg - list of geom3 objects
   * @returns {geom3} new geom3 object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const difference = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPolygons({}, []);
    case 1: return geometries[0];
    default: {
      let baseGeometry = geometries[0];
      let basePolygons = toPolygons({}, baseGeometry);
      // TODO: Figure out why we do not subtract the union of the remainder of
      // the geometries. This approach chains subtractions rather than producing
      // a generational tree.
      for (let i = 1; i < geometries.length; i++) {
        const subtractGeometry = geometries[i];

        const baseBsp = bsp.fromPolygons({}, basePolygons);
        const subtractBsp = bsp.fromPolygons({}, toPolygons({}, subtractGeometry));

        bsp.invert(baseBsp);
        bsp.clipTo(baseBsp, subtractBsp);
        bsp.clipTo(subtractBsp, baseBsp);

        bsp.invert(subtractBsp);
        bsp.clipTo(subtractBsp, baseBsp);
        bsp.invert(subtractBsp);

        bsp.build(baseBsp, bsp.toPolygons({}, subtractBsp));
        bsp.invert(baseBsp);

        basePolygons = bsp.toPolygons({}, baseBsp);
      }
      baseGeometry = fromPolygons({}, basePolygons);
      return baseGeometry;
    }
  }
};

module.exports = difference;
