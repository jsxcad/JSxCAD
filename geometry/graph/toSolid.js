import { eachFace } from './graph.js';
import { pushConvexPolygons } from './pushConvexPolygons.js';

export const toSolid = (graph) => {
  const solid = [];
  eachFace(graph, (face) => {
    const surface = [];
    pushConvexPolygons(surface, graph, face)
    if (surface.length > 0) {
      solid.push(surface);
    }
  });
  return solid;
};
