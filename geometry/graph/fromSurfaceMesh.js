import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromSurfaceMeshToGraph } from '@jsxcad/algorithm-cgal';

export const fromSurfaceMesh = (surfaceMesh) => {
  let graph = surfaceMesh[graphSymbol];
  if (graph === undefined) {
    console.log(`QQ/fromSurfaceMesh/computed`);
    graph = fromSurfaceMeshToGraph(surfaceMesh);
    surfaceMesh[graphSymbol] = graph;
    graph[surfaceMeshSymbol] = surfaceMesh;
  } else {
    console.log(`QQ/fromSurfaceMesh/cached`);
  }
  return graph;
};
