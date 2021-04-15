import { fromSurfaceMeshToTriangles } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

Error.stackTraceLimit = Infinity;

export const toTriangles = (graph) => {
  if (graph.isLazy) {
    return fromSurfaceMeshToTriangles(toSurfaceMesh(graph));
  } else {
    const triangles = [];
    // A realized graph should already be triangulated.
    for (let { edge } of graph.facets) {
      const triangle = [];
      const start = edge;
      do {
        triangle.push(graph.points[graph.edges[edge].point]);
        edge = graph.edges[edge].next;
      } while (start !== edge);
      triangles.push(triangle);
    }
    return triangles;
  }
};
