import { Polygon, point } from '@flatten-js/core';

export const fromSurface = (surface) => {
  const flattenPolygon = new Polygon();
  for (const polygon of surface) {
    flattenPolygon.addFace(polygon.map(([x, y]) => point(x, y)));
  }
  return flattenPolygon;
};

export const toSurface = (flattenPolygon) => {
console.log(`QQ/toSurface/svg: ${flattenPolygon.svg()}`);
  const z0Surface = [];
  for (const face of flattenPolygon.faces) {
    const z0Polygon = [];
    for (const edge of face) {
      const { x, y } = edge.start;
      z0Polygon.push([x, y, 0]);
    }
    z0Surface.push(z0Polygon);
  }
  return z0Surface;
}
