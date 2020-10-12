import { graphSymbol, nefPolyhedronSymbol } from './symbols.js';

import { fromSurfaceMeshToNefPolyhedron } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const toNefPolyhedron = (graph) => {
  let nefPolyhedron = graph[nefPolyhedronSymbol];
  if (nefPolyhedron === undefined) {
    const mesh = toSurfaceMesh(graph);
    nefPolyhedron = fromSurfaceMeshToNefPolyhedron(mesh);
    graph[nefPolyhedronSymbol] = nefPolyhedron;
    nefPolyhedron[graphSymbol] = graph;
  } else {
    console.log(`QQ/toNefPolyhedron/cached`);
  }
  return nefPolyhedron;
};
