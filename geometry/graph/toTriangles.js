import { fromSurfaceMeshToTriangles } from '@jsxcad/algorithm-cgal';
import { toSurface } from './toSurface.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const toTriangles = (graph) => {
  if (graph.isOutline) {
    // Outlines aren't compatible with SurfaceMesh.
    return toSurface(graph);
  } else {
    return fromSurfaceMeshToTriangles(toSurfaceMesh(graph));
  }
};
