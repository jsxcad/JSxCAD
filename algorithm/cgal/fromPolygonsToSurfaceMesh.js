import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';

export const fromPolygonsToSurfaceMesh = (jsPolygons) => {
  const c = getCgal();
  // FIX: Leaks.
  const points = new c.Points();
  const polygons = new c.Polygons();
  let index = 0;
  for (const jsPolygon of jsPolygons) {
    const polygon = new c.Polygon();
    for (const [x, y, z] of jsPolygon) {
      points.push_back(new c.Point(x, y, z));
      c.Polygon__push_back(polygon, index++);
    }
    polygons.push_back(polygon);
  }
  const surfaceMesh = c.FromPolygonSoupToSurfaceMesh(points, polygons);
  return surfaceMesh;
};
