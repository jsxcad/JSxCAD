import { arrangePaths } from '@jsxcad/algorithm-cgal';
import { realizeGraph } from './realizeGraph.js';

export const outline = (graph) => {
  graph = realizeGraph(graph);

  const faceEdges = new Map();

  const getFaceEdges = (face) => {
    let edges = faceEdges.get(face);
    if (edges === undefined) {
      edges = [];
      faceEdges.set(face, edges);
    }
    return edges;
  };

  // Collect edges per face.
  for (const edge of graph.edges) {
    if (!edge || edge.face === -1) {
      continue;
    }
    const twin = graph.edges[edge.twin];
    if (twin && twin.face === edge.face) {
      // This is an edge within a face.
      continue;
    }
    getFaceEdges(edge.face).push(edge);
  }

  const arrangements = [];

  // Arrange the edges per face.
  for (const [face, edges] of faceEdges) {
    const paths = [];
    // FIX: Use exact plane.
    const plane = graph.faces[face].plane;
    for (const { point, next } of edges) {
      paths.push([
        null,
        graph.points[point],
        graph.points[graph.edges[next].point],
      ]);
    }
    arrangements.push(...arrangePaths(...plane, paths));
  }

  return arrangements;
};
