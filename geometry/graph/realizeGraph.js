import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const realizeGraph = (graph) => {
  if (graph.isLazy) {
    return fromSurfaceMesh(toSurfaceMesh(graph));
  } else {
    return graph;
  }
};
