import {
  fromPolygonsToSurfaceMesh,
  fromSurfaceMeshToGraph,
} from '@jsxcad/algorithm-cgal';

export const fromSurface = (surface) =>
  fromSurfaceMeshToGraph(fromPolygonsToSurfaceMesh(surface));
