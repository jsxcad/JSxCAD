const plane = require('@jsxcad/math-plane');

const toPlane = (polygon) => {
  if (polygon.plane === undefined) {
    if (polygon.length >= 3) {
      // CHECKME: This will canonicalize the plane of an uncanonicalized poly.
      // polygon.plane = plane.canonicalize(plane.fromPoints(...polygon))
      polygon.plane = plane.fromPoints(...polygon);
    } else {
      polygon.plane = plane.create();
    }
  }
  // This might be undefined, if this is not a valid polygon.
  return polygon.plane;
};

module.exports = toPlane;
