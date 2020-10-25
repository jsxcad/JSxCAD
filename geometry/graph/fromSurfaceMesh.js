import { graphSymbol, surfaceMeshSymbol } from './symbols.js';

import { fromSurfaceMeshToGraph } from '@jsxcad/algorithm-cgal';
import { repair } from './repair.js';

export const fromSurfaceMesh = (surfaceMesh) => {
  let graph = surfaceMesh[graphSymbol];
  if (graph === undefined) {
    graph = fromSurfaceMeshToGraph(surfaceMesh);
    if (!repair(fromSurfaceMeshToGraph(surfaceMesh))) {
      // If the graph wasn't repaired, we can re-use the input mesh.
      surfaceMesh[graphSymbol] = graph;
      graph[surfaceMeshSymbol] = surfaceMesh;
    }
  }
  return graph;
};
