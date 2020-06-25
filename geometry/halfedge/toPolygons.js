/**
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Polygons} Polygons
 */

import eachLink from './eachLink';
import { pushWhenValid } from '@jsxcad/geometry-polygons';

/**
 * toPolygons
 *
 * @function
 * @param {Loops} loops
 * @returns {Polygons}
 */
export const toPolygons = (loops) => {
  const polygons = [];
  const faces = [];
  for (const loop of loops) {
    faces.push(loop.face);
    if (loop.face.holes) {
      faces.push(...loop.face.holes);
    }
  }
  for (const face of faces) {
    const polygon = [];
    eachLink(face, (edge) => {
      if (edge.face !== undefined) {
        polygon.push(edge.start);
      }
    });
    pushWhenValid(polygons, polygon);
  }
  return polygons;
};

export default toPolygons;
