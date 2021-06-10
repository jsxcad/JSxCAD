import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { info } from '@jsxcad/sys';
import { offsetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const offset = (geometry, initial, step, limit) => {
  info('offset begin');
  const offsetGraphs = [];
  for (const { polygonsWithHoles } of toPolygonsWithHoles(geometry)) {
    for (const polygonWithHoles of polygonsWithHoles) {
      for (const offsetPolygon of offsetOfPolygonWithHoles(
        initial,
        step,
        limit,
        polygonWithHoles
      )) {
        offsetGraphs.push(
          fromPolygonsWithHoles({ tags: geometry.tags }, [offsetPolygon])
        );
      }
    }
  }
  info('offset end');
  return offsetGraphs;
};
