import { eachFace } from './graph.js';
import pushConvexPolygons from './pushConvexPolygons.js';

export const toSolid = (graph) => {
  const solid = [];
  eachFace(graph, (face) => {
    const polygons = [];
    pushConvexPolygons(polygons, graph, face);
    if (polygons.length > 0) {
      solid.push(polygons);
    }
  });
  return solid;
};

export default toSolid;
