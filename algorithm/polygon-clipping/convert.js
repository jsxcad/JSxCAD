const X = 0;
const Y = 1;

export const fromSurface = (z0Surface) => {
  const polygons = [];
  for (const z0Polygon of z0Surface) {
    const polygon = z0Polygon.map(([x, y]) => [x, y]);
    // polygon-clipping requires repeating the first point to be closed.
    polygon.push(polygon[0]);
    polygons.push(polygon);
  }
  return polygons;
};

export const toSurface = (multiPolygon) => {
  const z0Surface = [];
  for (const polygons of multiPolygon) {
    for (const polygon of polygons) {
      const z0Polygon = [];
      for (const point of polygon) {
        z0Polygon.push([point[X], point[Y], 0]);
      }
      z0Polygon.pop();
      z0Surface.push(z0Polygon);
    }
  }
  return z0Surface;
};

export const clean = (multiPolygon) => multiPolygon;
