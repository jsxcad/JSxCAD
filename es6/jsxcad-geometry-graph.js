import { fromPolygons, toGraph, fromGraph, toPolygons } from './jsxcad-algorithm-occt.js';
import { transform as transform$1 } from './jsxcad-geometry-points.js';

const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  const shape = fromPolygons(polygons);
  const graph = toGraph(shape);
  return graph;
};

const toSolid = (graph) => {
  const shape = fromGraph(graph);
  const polygons = toPolygons(shape);
  // FIX: Gather faces properly or stop using solid.
  const solid = [];
  for (const polygon of polygons) {
    solid.push([polygon]);
  }
  return solid;
};

const transform = (matrix, graph) => ({
  ...graph,
  points: transform$1(matrix, graph.points),
});

export { fromSolid, toSolid, transform };
