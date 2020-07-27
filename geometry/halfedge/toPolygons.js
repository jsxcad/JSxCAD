/**
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Polygons} Polygons
 */

import eachLink from './eachLink.js';
import { pushWhenValid } from '@jsxcad/geometry-polygons';

/**
 * toPolygons
 *
 * @function
 * @param {Loops} loops
 * @returns {Polygons}
 */
export const toPolygons = (loops, includeFaces = true, includeHoles = true) => {
  const polygons = [];
  const faces = [];
  for (const loop of loops) {
    if (includeFaces) {
      faces.push(loop.face);
    }
    if (loop.face.holes && includeHoles) {
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
