import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { outlineOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) => {
  const outlineGraph = fromSurfaceMesh(
    outlineOfSurfaceMesh(toSurfaceMesh(graph))
  );
  outlineGraph.isOutline = true;
  outlineGraph.isWireframe = true;
  return outlineGraph;
};
