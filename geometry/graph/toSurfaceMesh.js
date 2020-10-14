import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromGraphToSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh === undefined) {
    console.log(`QQ/toSurfaceMesh/computed`);
    surfaceMesh = fromGraphToSurfaceMesh(graph);
    graph[surfaceMeshSymbol] = surfaceMesh;
    surfaceMesh[graphSymbol] = graph;
  } else {
    console.log(`QQ/toSurfaceMesh/cached`);
  }
  return surfaceMesh;
};
