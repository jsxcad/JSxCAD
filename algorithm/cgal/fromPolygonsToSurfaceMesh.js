import { getCgal } from './getCgal.js';

export const fromPolygonsToSurfaceMesh = (jsPolygons) => {
  const c = getCgal();
  // FIX: Leaks.
  const triples = new c.Triples();
  const polygons = new c.Polygons();
  let index = 0;
  for (const jsPolygon of jsPolygons) {
    const polygon = new c.Polygon();
    for (const [x, y, z] of jsPolygon) {
      c.addTriple(triples, x, y, z);
      c.Polygon__push_back(polygon, index++);
    }
    console.log(`QQ/polygon: ${polygon.size()}`);
    polygons.push_back(polygon);
  }
console.log(`QQ/points: ${triples.size()}`);
console.log(`QQ/polygons: ${polygons.size()}`);
  const surfaceMesh = c.FromPolygonSoupToSurfaceMesh(triples, polygons);
  return surfaceMesh;
};
