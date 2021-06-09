// import { fromPolygons } from './fromPolygons.js';
// import { toTriangles } from './toTriangles.js';

// Convert an outline graph to a possibly closed surface.
// export const fill = (graph) => fromPolygons(toTriangles(graph));

export const fill = (geometry) => ({
  ...geometry,
  graph: { ...geometry.graph, isOutline: true },
});
