import { eachFace } from './graph.js';
import { pushConvexPolygons } from './pushConvexPolygons.js';
import { realizeGraph } from './realizeGraph.js';

// FIX: Check coplanarity?
export const toSurface = (graph) => {
  const surface = [];
  eachFace(realizeGraph(graph), (face) => {
    pushConvexPolygons(surface, graph, face);
  });
  return surface;
};
