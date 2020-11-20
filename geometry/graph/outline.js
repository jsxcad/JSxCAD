import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { outlineOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) => {
  if (graph.isOutline) {
    if (graph.isWireframe) {
      return graph;
    } else {
      return { ...graph, isWireframe: true };
    }
  }
  const outlineGraph = fromSurfaceMeshLazy(
    outlineOfSurfaceMesh(toSurfaceMesh(graph))
  );
  outlineGraph.isOutline = true;
  outlineGraph.isWireframe = true;
  return outlineGraph;
};
