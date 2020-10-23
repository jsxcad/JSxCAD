import { graphSymbol, nefPolyhedronSymbol } from './symbols.js';

import { fromNefPolyhedronToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';

// This is for a proper manifold, but will not produce a simplified outline.

export const fromNefPolyhedron = (nefPolyhedron) => {
  let graph = nefPolyhedron[graphSymbol];
  if (graph === undefined) {
    const surfaceMesh = fromNefPolyhedronToSurfaceMesh(nefPolyhedron);
    graph = fromSurfaceMesh(surfaceMesh);
    nefPolyhedron[graphSymbol] = graph;
    graph[nefPolyhedronSymbol] = nefPolyhedron;
  } else {
  }
  return graph;
};
