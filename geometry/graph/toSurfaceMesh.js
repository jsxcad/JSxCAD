import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromGraphToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurface } from './fromSurface.js';
import { toSurface } from './toSurface.js';

export const toSurfaceMesh = (graph) => {
  let surfaceMesh = graph[surfaceMeshSymbol];
  if (surfaceMesh === undefined) {
    if (graph.isOutline) {
      // SurfaceMesh can't handle outlines -- rebuild as a surface.
      return toSurfaceMesh(fromSurface(toSurface(graph)));
    } else {
      surfaceMesh = fromGraphToSurfaceMesh(graph);
    }
    graph[surfaceMeshSymbol] = surfaceMesh;
    surfaceMesh[graphSymbol] = graph;
  } else {
  }
  return surfaceMesh;
};
