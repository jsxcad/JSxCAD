import {
  fromPointsToSurfaceMesh,
  fromSurfaceMeshToGraph,
} from '@jsxcad/algorithm-cgal';

import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

export const fromPoints = (points) => {
  const mesh = fromPointsToSurfaceMesh(points);
  const graph = fromSurfaceMeshToGraph(mesh);
  graph[surfaceMeshSymbol] = mesh;
  mesh[graphSymbol] = graph;
  return graph;
};
