import { eachFace } from './graph.js';
import { pushConvexPolygons } from './pushConvexPolygons.js';

import { realizeGraph } from './realizeGraph.js';

export const toSolid = (graph) => {
  const solid = [];
  eachFace(realizeGraph(graph), (face) => {
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
