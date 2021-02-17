import { fromArrangements } from './fromArrangements.js';
import { offsetOfPolygon } from '@jsxcad/algorithm-cgal';
import { outline } from './outline.js';

export const offset = (graph, initial, step, limit) => {
  const offsetArrangements = [];
  for (const arrangement of outline(graph)) {
    for (const offsetArrangement of offsetOfPolygon(
      initial,
      step,
      limit,
      arrangement.plane,
      arrangement.boundary,
      arrangement.holes
    )) {
      offsetArrangements.push(offsetArrangement);
    }
  }
  const offsetGraph = fromArrangements(offsetArrangements);
  offsetGraph.isClosed = false;
  offsetGraph.isOutline = true;
  if (offsetGraph.points.length === 0) {
    offsetGraph.isEmpty = true;
  }
  return offsetGraph;
};
