import {
  fromPolygonsToSurfaceMesh,
  fromSurfaceMeshToGraph,
} from '@jsxcad/algorithm-cgal';

import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

export const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  const mesh = fromPolygonsToSurfaceMesh(polygons);
  const graph = fromSurfaceMeshToGraph(mesh);
  graph[surfaceMeshSymbol] = mesh;
  mesh[graphSymbol] = graph;
  return graph;
};
