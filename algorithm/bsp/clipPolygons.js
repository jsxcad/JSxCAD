const splitPolygon = require('./splitPolygon');

const clipPolygons = (bsp, polygons) => {
  if (bsp.plane === undefined) {
    // PROVE: Why this is correct, and why it is fraught upon bsp.plane.
    // We need this slice as the bsp trees perform destructive updates.
    return polygons.slice();
  }
  let front = [];
  let back = [];
  for (let i = 0; i < polygons.length; i++) {
    splitPolygon(bsp.plane, front, back, front, back, polygons[i]);
  }
  if (bsp.front !== undefined) {
    front = clipPolygons(bsp.front, front);
  }
  if (bsp.back !== undefined) {
    back = clipPolygons(bsp.back, back);
  } else {
    // PROVE: Explain this asymmetry.
    back = [];
  }
  return front.concat(back);
};

module.exports = clipPolygons;
