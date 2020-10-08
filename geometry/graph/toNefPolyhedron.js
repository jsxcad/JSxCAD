import {
  // fromPolygonsToSurfaceMesh,
  // fromSurfaceMeshToNefPolyhedron
  fromPolygonsToNefPolyhedron,
} from '@jsxcad/algorithm-cgal';

import { nefPolyhedronSymbol } from './symbols.js';
import { toSolid } from './toSolid.js';

export const toNefPolyhedron = (graph) => {
  let nefPolyhedron = graph[nefPolyhedronSymbol];
  if (nefPolyhedron === undefined) {
    const polygons = [];
    const solid = toSolid(graph);
    for (const surface of solid) {
      polygons.push(...surface);
    }
    // nefPolyhedron = fromSurfaceMeshToNefPolyhedron(fromPolygonsToSurfaceMesh(polygons));
    nefPolyhedron = fromPolygonsToNefPolyhedron(polygons);
    graph[nefPolyhedronSymbol] = nefPolyhedron;
  }
  return nefPolyhedron;
};
