const canonicalize = require('./canonicalize');
const fromPolygons = require('./fromPolygons');
const bsp = require('@jsxcad/algorithm-bsp');

const union = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPolygons({}, []);
    case 1: return geometries[0];
    default: {
      while (geometries.length >= 2) {
        const aGeometry = geometries.shift();
        const bGeometry = geometries.shift();

        const aBsp = bsp.fromPolygons({}, canonicalize(aGeometry).polygons);
        const bBsp = bsp.fromPolygons({}, canonicalize(bGeometry).polygons);

        // Remove the bits of a that are in b.
        bsp.clipTo(aBsp, bBsp);

        // Remove the bits of b that are in a.
        bsp.clipTo(bBsp, aBsp);

        // Turn b inside out and remove the bits that are in a.
        // PROVE: I assume this is to simplify the internal structure of b.
        bsp.invert(bBsp);
        bsp.clipTo(bBsp, aBsp);
        bsp.invert(bBsp);

        // Now merge the two together.
        bsp.build(aBsp, bsp.toPolygons({}, bBsp));

        // And build a geometry from the result.
        geometries.push(fromPolygons({}, bsp.toPolygons({}, aBsp)));
      }
      return geometries[0];
    }
  }
};

module.exports = union;
