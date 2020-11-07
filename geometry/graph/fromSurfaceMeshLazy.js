import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromSurfaceMeshToLazyGraph } from '@jsxcad/algorithm-cgal';

export const fromSurfaceMeshLazy = (surfaceMesh) => {
  let graph = surfaceMesh[graphSymbol];
  if (graph === undefined) {
    graph = fromSurfaceMeshToLazyGraph(surfaceMesh);
    surfaceMesh[graphSymbol] = graph;
    graph[surfaceMeshSymbol] = surfaceMesh;
  }
  return graph;
};
