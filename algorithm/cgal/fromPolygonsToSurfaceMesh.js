import { getCgal } from './getCgal.js';

export const fromPolygonsToSurfaceMesh = (jsPolygons) => {
  const c = getCgal();
  const surfaceMesh = c.FromPolygonSoupToSurfaceMesh((triples, polygons) => {
    let index = 0;
    for (const jsPolygon of jsPolygons) {
      const polygon = new c.Polygon();
      for (const [x, y, z] of jsPolygon) {
        c.addTriple(triples, x, y, z);
        c.Polygon__push_back(polygon, index++);
      }
      polygons.push_back(polygon);
    }
  });
  return surfaceMesh;
};
