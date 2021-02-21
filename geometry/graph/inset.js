import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { insetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { outline } from './outline.js';

export const inset = (graph, initial, step, limit) => {
  const insetPolygonsWithHoles = [];
  for (const polygonWithHoles of outline(graph)) {
    insetPolygonsWithHoles.push(
      ...insetOfPolygonWithHoles(initial, step, limit, polygonWithHoles)
    );
  }
  const insetGraph = fromPolygonsWithHoles(insetPolygonsWithHoles);
  insetGraph.isClosed = false;
  insetGraph.isOutline = true;
  if (insetGraph.points.length === 0) {
    insetGraph.isEmpty = true;
  }
  return insetGraph;
};
