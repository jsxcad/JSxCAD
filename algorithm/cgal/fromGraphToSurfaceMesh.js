import { getCgal } from './getCgal.js';

// Note: This assumes a graph without holes.
export const fromGraphToSurfaceMesh = (graph) => {
  const c = getCgal();

  const mesh = new c.Surface_mesh();

  const vertexIndex = [];
  graph.exact.forEach(([x, y, z]) =>
    vertexIndex.push(c.Surface_mesh__add_exact(mesh, x, y, z))
  );

  // Surface_mesh faces are loops.

  graph.loops.forEach(({ edge }, loop) => {
    if (
      c.Surface_mesh__add_face_vertices(mesh, () => {
        const edgeNode = graph.edges[edge];
        edge = edgeNode.next;
        return vertexIndex[edgeNode.point];
      }) > 1000000
    ) {
      throw Error('die');
    }
  });

  if (!mesh.is_valid(false)) {
    throw Error('die');
  }

  return mesh;
};
