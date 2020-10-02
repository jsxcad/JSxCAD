import { toGraph, cut, fromGraph, fromPolygons, common, toPolygons, fuse } from './jsxcad-algorithm-occt.js';
import { transform as transform$1 } from './jsxcad-geometry-points.js';

const difference = (a, b) => toGraph(cut(fromGraph(a), fromGraph(b)));

const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  const shape = fromPolygons(polygons);
  const graph = toGraph(shape);
  return graph;
};

const intersection = (a, b) => toGraph(common(fromGraph(a), fromGraph(b)));

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

const union = (a, b) => toGraph(fuse(fromGraph(a), fromGraph(b)));

export { difference, fromSolid, intersection, toSolid, transform, union };
