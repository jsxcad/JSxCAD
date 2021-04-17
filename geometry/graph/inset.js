import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { insetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';
import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const inset = (graph, initial, step, limit) => {
  const insetGraphs = [];
  for (const { plane, exactPlane, polygonsWithHoles } of toPolygonsWithHoles(
    graph
  )) {
    console.log(`QQ/inset/group: ${JSON.stringify({ plane, exactPlane })}`);
    for (const polygonWithHoles of polygonsWithHoles) {
      console.log(
        `QQ/inset/polygon: ${JSON.stringify({
          plane: polygonWithHoles.plane,
          exactPlane: polygonWithHoles.exactPlane,
        })}`
      );
      for (const insetPolygon of insetOfPolygonWithHoles(
        initial,
        step,
        limit,
        polygonWithHoles
      )) {
        insetGraphs.push(fromPolygonsWithHoles([insetPolygon]));
      }
    }
  }
  return insetGraphs;
};
