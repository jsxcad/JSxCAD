import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromSurfaceMeshToGraph } from '@jsxcad/algorithm-cgal';
import { repair } from './repair.js';

export const fromSurfaceMesh = (surfaceMesh) => {
  throw Error('die');
  if (surfaceMesh === undefined) {
    throw Error('No surface mesh provided');
  }
  if (surfaceMesh.provenance === undefined) {
    throw Error('Surface mesh has no provenance');
  }
  let graph = surfaceMesh[graphSymbol];
  if (graph === undefined || graph.isLazy) {
    const converted = fromSurfaceMeshToGraph(surfaceMesh);
    if (graph.isLazy) {
      Object.assign(graph, converted, { isLazy: false });
    } else {
      graph = converted;
    }
    // If the graph wasn't repaired, we can re-use the input mesh.
    surfaceMesh[graphSymbol] = graph;
    graph[surfaceMeshSymbol] = surfaceMesh;
  }
  return graph;
};
