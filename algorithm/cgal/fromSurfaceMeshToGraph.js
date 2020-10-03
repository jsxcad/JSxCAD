import { getCgal } from './getCgal.js';

export const fromSurfaceMeshToGraph = (mesh) => {
  const c = getCgal();
  const graph = { edges: [], faces: [], loops: [], points: [] };
  c.Surface_mesh__EachFace(mesh, face => {
    const halfedge = c.Surface_mesh__face_to_halfedge(mesh, face);
    graph.faces[face] = { loop: face };
    graph.loops[face] = { edge: halfedge };
    const start = halfedge;
    let current = start;
    do {
      const next = c.Surface_mesh__halfedge_to_next_halfedge(mesh, current);
      const opposite = c.Surface_mesh__halfedge_to_opposite_halfedge(mesh, current);
      const target = c.Surface_mesh__halfedge_to_target(mesh, current);
      graph.edges[halfedge] = { point: target, next, loop: face, twin: opposite };
      if (graph.points[target] === undefined) {
        const point = c.Surface_mesh__vertex_to_point(mesh, target);
        graph.points[target] = [point.x(), point.y(), point.z()];
      }
      current = next;
    } while (current !== start);
  });
  return graph;
}
