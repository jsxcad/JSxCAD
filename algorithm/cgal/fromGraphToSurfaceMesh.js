import { getCgal } from './getCgal.js';

// Note: This assumes a graph without holes.
export const fromGraphToSurfaceMesh = (graph) => {
  const c = getCgal();

  const mesh = new c.Surface_mesh();

  const vertexIndex = [];
  graph.exactPoints.forEach(([x, y, z]) =>
    vertexIndex.push(c.Surface_mesh__add_exact(mesh, x, y, z))
  );

  const seen = new Set();

  graph.facets.forEach(({ edge }) => {
    c.Surface_mesh__add_face_vertices(mesh, () => {
      seen.add(edge);
      const edgeNode = graph.edges[edge];
      edge = edgeNode.next;
      return vertexIndex[edgeNode.point];
    });
  });

  if (!mesh.is_valid(false)) {
    throw Error('die');
  }

  return mesh;
};
