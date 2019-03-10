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

export const z0SurfacesToClipping = (z0Surfaces) => {
  return z0Surfaces.map(z0Surface => z0Surface.map(z0Polygon => z0Polygon.map(([x = 0, y = 0]) => [x, y])));
};
