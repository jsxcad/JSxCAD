import { eachFace } from './graph.js';
import { pushConvexPolygons } from './pushConvexPolygons.js';

export const toSolid = (graph) => {
  const solid = [];
  eachFace(graph, (face) => {
    const surface = [];
    try {
      pushConvexPolygons(surface, graph, face);
    } catch (e) {
      console.log(e.stack);
    }
    if (surface.length > 0) {
      solid.push(surface);
    }
  });
  return solid;
};
