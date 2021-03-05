import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromGraphToSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh === undefined) {
    surfaceMesh = fromGraphToSurfaceMesh(graph);
    graph[surfaceMeshSymbol] = surfaceMesh;
    surfaceMesh[graphSymbol] = graph;
  } else {
  }
  return surfaceMesh;
};
