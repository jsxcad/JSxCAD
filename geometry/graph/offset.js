import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { info } from '@jsxcad/sys';
import { offsetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const offset = (graph, initial, step, limit) => {
  info('offset begin');
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
  info('offset end');
  return offsetGraphs;
};
