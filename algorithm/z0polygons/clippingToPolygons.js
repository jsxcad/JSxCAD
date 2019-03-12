// Internal function to massage data for passing to polygon-clipping.
export const clippingToPolygons = (clipping) => {
  const polygonArray = [];
  for (const polygons of clipping) {
    for (const polygon of polygons) {
      polygon.pop();
      polygonArray.push(polygon);
    }
  }
  return polygonArray;
};

export const z0SurfaceToClipping = (z0Surface) => {
  // return z0Surface.map(z0Polygon => [z0Polygon.map(([x = 0, y = 0]) => [x, y])]);
  return [z0Surface.map(z0Polygon => z0Polygon.map(([x = 0, y = 0]) => [x, y]))];
};
