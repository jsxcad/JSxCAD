import { arrangePaths } from '@jsxcad/algorithm-cgal';
import { realizeGraph } from './realizeGraph.js';

export const toPolygonsWithHoles = (graph) => {
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

  const polygonWithHoles = [];

  // Arrange the edges per face.
  for (const [face, edges] of faceEdges) {
    if (face === -1) {
      // We can't arrange edges that aren't in a face.
      // FIX: Sometimes we'll want edges that aren't in faces or facets.
      continue;
    }
    const paths = [];
    // FIX: Use exact plane.
    const { plane, exactPlane } = graph.faces[face];
    for (const { point, next } of edges) {
      paths.push({
        points: [
          null,
          graph.points[point],
          graph.points[graph.edges[next].point],
        ],
      });
    }
    polygonWithHoles.push(
      ...arrangePaths(plane, exactPlane, paths, /* triangulate= */ false)
    );
  }

  return polygonWithHoles;
};
