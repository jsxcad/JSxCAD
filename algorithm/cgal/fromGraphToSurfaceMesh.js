import { getCgal } from './getCgal.js';

// Note: This assumes a graph without holes.
export const fromGraphToSurfaceMesh = (graph) => {
  const c = getCgal();

  const mesh = new c.Surface_mesh();

  const vertexIndex = [];
  const vertexEdge = [];
  graph.points.forEach(([x, y, z]) =>
    vertexIndex.push(c.Surface_mesh__add_vertex(mesh, x, y, z))
  );

  const faceIndex = [];
  graph.loops.forEach((_, loop) =>
    faceIndex.push(c.Surface_mesh__add_face(mesh))
  );

  const edgeIndex = [];
  graph.edges.forEach(({ point, twin }, edge) => {
    // Edges are always paired.
    if (edgeIndex[edge] !== undefined) {
      return;
    }
    const index = c.Surface_mesh__add_edge(mesh);
    edgeIndex[edge] = index;
    if (twin !== -1) {
      edgeIndex[twin] = index + 1;
    }
    if (vertexEdge[point] === undefined) {
      // Associate each vertex with an arbitrary incoming edge.
      c.Surface_mesh__set_vertex_edge(
        mesh,
        vertexIndex[point],
        edgeIndex[edge]
      );
    }
  });

  graph.edges.forEach(({ point, next, loop, twin }, edge) => {
    if (point >= graph.points.length) throw Error('die');
    c.Surface_mesh__set_edge_target(mesh, edgeIndex[edge], vertexIndex[point]);

    if (edge >= graph.edges.length) throw Error('die');
    c.Surface_mesh__set_edge_next(mesh, edgeIndex[edge], edgeIndex[next]);

    if (loop >= graph.loops.length) throw Error('die');
    c.Surface_mesh__set_edge_face(mesh, edgeIndex[edge], faceIndex[loop]);
  });

  graph.loops.forEach(({ edge }, loop) => {
    c.Surface_mesh__set_face_edge(mesh, loop, edge);
  });

  return mesh;
};
