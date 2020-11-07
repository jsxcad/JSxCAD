import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { surfaceMeshSymbol } from './symbols.js';

export const realizeGraph = (graph) => {
  if (graph.isLazy) {
    return fromSurfaceMesh(graph[surfaceMeshSymbol]);
  } else {
    return graph;
  }
};
