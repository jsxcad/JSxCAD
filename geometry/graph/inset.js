import { fromPaths } from './fromPaths.js';
import { insetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { outline } from './outline.js';

export const inset = (graph, initial, step, limit) => {
  const insetGraphs = [];
  for (const polygonWithHoles of outline(graph)) {
    for (const insetPolygon of insetOfPolygonWithHoles(
      initial,
      step,
      limit,
      polygonWithHoles
    )) {
      insetGraphs.push(fromPaths([insetPolygon], insetPolygon.plane));
    }
  }
  return insetGraphs;
};
