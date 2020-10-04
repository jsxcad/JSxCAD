import {
  fromPolygonsToSurfaceMesh,
  fromSurfaceMeshToGraph,
} from '@jsxcad/algorithm-cgal';

export const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  const mesh = fromPolygonsToSurfaceMesh(polygons);
  const graph = fromSurfaceMeshToGraph(mesh);
  return graph;
};
