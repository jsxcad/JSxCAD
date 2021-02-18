import { getCgal } from './getCgal.js';

// Note: This assumes a graph without holes.
export const fromGraphToSurfaceMesh = (graph) => {
  const c = getCgal();

  const mesh = new c.Surface_mesh();

  const vertexIndex = [];
  graph.exactPoints.forEach(([x, y, z]) => {
    vertexIndex.push(c.Surface_mesh__add_exact(mesh, x, y, z));
  });

  graph.facets.forEach(({ edge }, facet) => {
    const faceIndex = c.Surface_mesh__add_face_vertices(mesh, () => {
      const edgeNode = graph.edges[edge];
      edge = edgeNode.next;
      return vertexIndex[edgeNode.point];
    });
    if (faceIndex === 4294967295 /* -1 */) {
      throw Error(`Face could not be added`);
    }
  });

  if (!mesh.is_valid(false)) {
    throw Error('die');
  }

  return mesh;
};
