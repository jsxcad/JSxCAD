import { graphSymbol, nefPolyhedronSymbol } from './symbols.js';

import { fromNefPolyhedronToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

// This is for a proper manifold, but will not produce a simplified outline.

export const fromNefPolyhedron = ({ tags }, nefPolyhedron) => {
  let graph = nefPolyhedron[graphSymbol];
  if (graph === undefined) {
    const surfaceMesh = fromNefPolyhedronToSurfaceMesh(nefPolyhedron);
    graph = fromSurfaceMeshLazy(surfaceMesh);
    nefPolyhedron[graphSymbol] = graph;
    graph[nefPolyhedronSymbol] = nefPolyhedron;
  } else {
  }
  return taggedGraph({ tags }, graph);
};
