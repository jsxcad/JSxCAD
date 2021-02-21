import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { offsetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { outline } from './outline.js';

export const offset = (graph, initial, step, limit) => {
  const offsetPolygonsWithHoles = [];
  for (const polygonWithHoles of outline(graph)) {
    offsetPolygonsWithHoles.push(
      ...offsetOfPolygonWithHoles(initial, step, limit, polygonWithHoles)
    );
  }
  const offsetGraph = fromPolygonsWithHoles(offsetPolygonsWithHoles);
  offsetGraph.isClosed = false;
  offsetGraph.isOutline = true;
  if (offsetGraph.points.length === 0) {
    offsetGraph.isEmpty = true;
  }
  return offsetGraph;
};
