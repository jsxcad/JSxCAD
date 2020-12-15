import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { smoothSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (graph, options) => {
  const smoothedGraph = fromSurfaceMeshLazy(
    smoothSurfaceMesh(toSurfaceMesh(graph), options)
  );
  smoothedGraph.isWireframe = true;
  return smoothedGraph;
};
