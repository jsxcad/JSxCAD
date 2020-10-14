import {
  fromPolygonsToSurfaceMesh,
  fromSurfaceMeshToGraph,
} from '@jsxcad/algorithm-cgal';

import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

export const fromPolygons = (polygons) => {
  const mesh = fromPolygonsToSurfaceMesh(polygons);
  const graph = fromSurfaceMeshToGraph(mesh);
  graph[surfaceMeshSymbol] = mesh;
  mesh[graphSymbol] = graph;
  return graph;
};
