import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { info } from '@jsxcad/sys';
import { insetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { taggedPolygonsWithHoles } from '../tagged/taggedPolygonsWithHoles.js';
import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const inset = (geometry, initial, step, limit) => {
  info('inset begin');
  const insetGraphs = [];
  const { tags, plane, exactPlane } = geometry;
  for (const { polygonsWithHoles } of toPolygonsWithHoles(geometry)) {
    for (const polygonWithHoles of polygonsWithHoles) {
      for (const insetPolygon of insetOfPolygonWithHoles(
        initial,
        step,
        limit,
        polygonWithHoles
      )) {
        insetGraphs.push(
          fromPolygonsWithHoles(
            taggedPolygonsWithHoles({ tags, plane, exactPlane }, [insetPolygon])
          )
        );
      }
    }
  }
  info('inset end');
  return insetGraphs;
};
