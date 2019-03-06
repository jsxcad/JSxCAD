const plane = require('@jsxcad/math-plane');
const poly3 = require('@jsxcad/math-poly3');

const invert = (bsp) => {
  // Flip the polygons.
  bsp.polygons = bsp.polygons.map(poly3.flip);
  // Recompute the plane.
  if (bsp.plane !== undefined) {
    // PROVE: General equivalence.
    // const a = poly3.toPlane(bsp.polygons[0]);
    // const b = plane.flip(bsp.plane);
    // if (!plane.equals(a, b)) { throw Error(`die: ${JSON.stringify([a, b])}`); }
    bsp.plane = plane.flip(bsp.plane);
  }
  // Invert the children.
  if (bsp.front !== undefined) {
    invert(bsp.front);
  }
  if (bsp.back !== undefined) {
    invert(bsp.back);
  }
  // Swap the children.
  [bsp.front, bsp.back] = [bsp.back, bsp.front];
};

module.exports = invert;
