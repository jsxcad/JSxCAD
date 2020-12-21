import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { smoothSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (graph, { length = 1, angle = 10 } = {}) => {
  const smoothedGraph = fromSurfaceMeshLazy(
    smoothSurfaceMesh(toSurfaceMesh(graph), length, angle)
  );
  // smoothedGraph.isWireframe = true;
  return smoothedGraph;
};
