import { Loops, Polygons } from './types';

import eachLink from './eachLink';
import { pushWhenValid } from '@jsxcad/geometry-polygons';

/**
 * toPolygons
 *
 * @param {Loops} loops
 * @returns {Polygons}
 */
export const toPolygons = (loops) => {
  const polygons = [];
  for (const loop of loops) {
    const polygon = [];
    eachLink(loop,
             edge => {
               if (edge.face !== undefined) {
                 polygon.push(edge.start);
               }
             });
    pushWhenValid(polygons, polygon);
  }
  return polygons;
};

export default toPolygons;
