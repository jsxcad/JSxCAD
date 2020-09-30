import { fromGraph, toPolygons } from '@jsxcad/algorithm-occt';

export const toSolid = (graph) => {
  const shape = fromGraph(graph);
  const polygons = toPolygons(shape);
  // FIX: Gather faces properly or stop using solid.
  const solid = [];
  for (const polygon of polygons) {
    solid.push([polygon]);
  }
  return solid;
};
