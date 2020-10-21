import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromGraphToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurface } from './fromSurface.js';
import { toSurface } from './toSurface.js';

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh === undefined) {
    console.log(`QQ/toSurfaceMesh/computed`);
    if (graph.isOutline) {
      // SurfaceMesh can't handle outlines.
      surfaceMesh = fromGraphToSurfaceMesh(fromSurface(toSurface(graph)));
    } else {
      surfaceMesh = fromGraphToSurfaceMesh(graph);
    }
    graph[surfaceMeshSymbol] = surfaceMesh;
    surfaceMesh[graphSymbol] = graph;
  } else {
    console.log(`QQ/toSurfaceMesh/cached`);
  }
  return surfaceMesh;
};
