import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { outlineOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) => {
  const outlineGraph = fromSurfaceMeshLazy(
    outlineOfSurfaceMesh(toSurfaceMesh(graph))
  );
  outlineGraph.isOutline = true;
  outlineGraph.isWireframe = true;
  return outlineGraph;
};
