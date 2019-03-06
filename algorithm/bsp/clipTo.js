const clipPolygons = require('./clipPolygons');

// Destructively remove all polygons from a that are in b.
const clipTo = (a, b) => {
  a.polygons = clipPolygons(b, a.polygons);
  if (a.front !== undefined) {
    clipTo(a.front, b);
  }
  if (a.back !== undefined) {
    clipTo(a.back, b);
  }
};

module.exports = clipTo;
