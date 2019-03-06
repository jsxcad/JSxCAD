// Internal function to massage data for passing to polygon-clipping.
const clippingToPolygons = (clipping) => {
  const polygonArray = [];
  for (const polygons of clipping) {
    for (const polygon of polygons) {
      polygon.pop();
      polygonArray.push(polygon);
    }
  }
  return polygonArray;
};

module.exports = clippingToPolygons;
