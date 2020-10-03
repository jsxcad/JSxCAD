import { fromPolygonsToSurfaceMesh, fromSurfaceMeshToGraph } from '@jsxcad/algorithm-cgal';

export const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  const surfaceMesh = fromPolygonsToSurfaceMesh(polygons);
  const graph = fromSurfaceMeshToGraph(shape);
  return graph;
};
