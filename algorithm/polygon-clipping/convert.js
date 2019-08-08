import { equals } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;

export const fromSurface = (surface) => {
  return surface.map(z0Polygon => {
                       const polygon = z0Polygon.map(([x, y]) => [x, y]);
                       // Repeat the first point at the end to close the polygon.
                       polygon.push(polygon[0]);
                       return polygon;
                     });
}
export const toSurface = (multiPolygon) => {
  const z0Surface = [];
  for (const polygons of multiPolygon) {
    for (const polygon of polygons) {
      const points = [];
      const z0Polygon = polygon.map(point => [point[X], point[Y], 0]);
      // Remove repeated last point.
      if (!equals(z0Polygon[0], z0Polygon[z0Polygon.length - 1])) {
        throw Error('die');
      }
      z0Polygon.pop();
      z0Surface.push(z0Polygon);
    }
  }
  return z0Surface;
}
