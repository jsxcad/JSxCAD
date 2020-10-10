import {
  fromPolygonsToNefPolyhedron,
  fromPolygonsToSurfaceMesh,
  fromSurfaceMeshToNefPolyhedron,
} from '@jsxcad/algorithm-cgal';

import { graphSymbol, nefPolyhedronSymbol } from './symbols.js';

import { toSolid } from './toSolid.js';

export const toNefPolyhedron = (graph) => {
  let nefPolyhedron = graph[nefPolyhedronSymbol];
  if (nefPolyhedron === undefined) {
    console.log(`QQ/toNefPolyhedron/computed`);
    const polygons = [];
    const solid = toSolid(graph);
    for (const surface of solid) {
      polygons.push(...surface);
    }
    nefPolyhedron = fromSurfaceMeshToNefPolyhedron(
      fromPolygonsToSurfaceMesh(polygons)
    );
    // nefPolyhedron = fromPolygonsToNefPolyhedron(polygons);
    graph[nefPolyhedronSymbol] = nefPolyhedron;
    nefPolyhedron[graphSymbol] = graph;
  } else {
    console.log(`QQ/toNefPolyhedron/cached`);
  }
  return nefPolyhedron;
};
