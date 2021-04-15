import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { offsetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const offset = (graph, initial, step, limit) => {
  const offsetGraphs = [];
  for (const { polygonsWithHoles } of toPolygonsWithHoles(graph)) {
    for (const polygonWithHoles of polygonsWithHoles) {
      for (const offsetPolygon of offsetOfPolygonWithHoles(
        initial,
        step,
        limit,
        polygonWithHoles
      )) {
        offsetGraphs.push(fromPolygonsWithHoles([offsetPolygon]));
      }
    }
  }
  return offsetGraphs;
};
