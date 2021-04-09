import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { surfaceMeshSymbol } from './symbols.js';

export const realizeGraph = (graph) => {
  if (graph.isLazy) {
    // throw Error(`die`);
    return fromSurfaceMesh(graph[surfaceMeshSymbol]);
  } else {
    return graph;
  }
};
