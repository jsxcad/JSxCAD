import { realizeGraph } from './realizeGraph.js';

export const toTriangles = (graph) => {
  const triangles = [];
  // The realized graph should already be triangulated.
  graph = realizeGraph(graph);
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
};
