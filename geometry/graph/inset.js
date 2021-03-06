import { fromPaths } from './fromPaths.js';
import { fromPolygonWithHolesToPaths } from './fromPolygonWithHolesToPaths.js';
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
      insetGraphs.push(fromPaths(fromPolygonWithHolesToPaths(insetPolygon)));
    }
  }
  return insetGraphs;
};
