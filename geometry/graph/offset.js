import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { offsetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { taggedPolygonsWithHoles } from '../tagged/taggedPolygonsWithHoles.js';
import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const offset = (geometry, initial, { segments, step, limit } = {}) => {
  const offsetGraphs = [];
  const { tags, plane, exactPlane } = geometry;
  for (const { polygonsWithHoles } of toPolygonsWithHoles(geometry)) {
    for (const polygonWithHoles of polygonsWithHoles) {
      for (const offsetPolygon of offsetOfPolygonWithHoles(
        initial,
        step,
        limit,
        segments,
        polygonWithHoles
      )) {
        offsetGraphs.push(
          fromPolygonsWithHoles(
            taggedPolygonsWithHoles({ tags, plane, exactPlane }, [
              offsetPolygon,
            ])
          )
        );
      }
    }
  }
  return offsetGraphs;
};
