import { getCgal } from './getCgal.js';

export const fromPolygonsToSurfaceMesh = (jsPolygons) => {
  const c = getCgal();
  const surfaceMesh = c.FromPolygonSoupToSurfaceMesh((triples, polygons) => {
    let index = 0;
    // FIX: Prefer exactPoints
    for (const { points } of jsPolygons) {
      // FIX: Clean this up and use exactPoints.
      const polygon = new c.Polygon();
      for (const [x, y, z] of points) {
        c.addTriple(triples, x, y, z);
        c.Polygon__push_back(polygon, index++);
      }
      polygons.push_back(polygon);
    }
  });
  return surfaceMesh;
};
