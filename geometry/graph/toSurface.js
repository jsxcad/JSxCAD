import { eachFace } from './graph.js';
import { pushConvexPolygons } from './pushConvexPolygons.js';

// FIX: Check coplanarity?
export const toSurface = (graph) => {
  const surface = [];
  eachFace(graph, (face) => {
    pushConvexPolygons(surface, graph, face);
  });
  return surface;
};
