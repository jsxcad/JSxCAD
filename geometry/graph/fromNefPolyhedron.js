import { graphSymbol, nefPolyhedronSymbol } from './symbols.js';

import { fromNefPolyhedronShellsToGraph } from '@jsxcad/algorithm-cgal';

export const fromNefPolyhedron = (nefPolyhedron) => {
  let graph = nefPolyhedron[graphSymbol];
  if (graph === undefined) {
    console.log(`QQ/fromNefPolyhedron/computed`);
    graph = fromNefPolyhedronShellsToGraph(nefPolyhedron);
    nefPolyhedron[graphSymbol] = graph;
    graph[nefPolyhedronSymbol] = nefPolyhedron;
  } else {
    console.log(`QQ/fromNefPolyhedron/cached`);
  }
  return graph;
};
