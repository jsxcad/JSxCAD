import { fromSurfaceMesh, toSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const rerealizeGraph = (graph) =>
  fromSurfaceMesh(toSurfaceMesh(graph), /* forceNewGraph= */ true);
