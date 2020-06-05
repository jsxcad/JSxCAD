/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").PointSelector} PointSelector
 * @typedef {import("./types").Solid} Solid
 */

import eachLink from './eachLink';
import pushConvexPolygons from './pushConvexPolygons';

const walked = Symbol('walked');

/*
const pushPolygon = (polygons, loop) => {
  const polygon = [];
  eachLink(loop, link => polygon.push(link.start));
  polygons.push(polygon);
};
*/

// FIX: Coplanar surface coherence.
/**
 * toSolid
 *
 * @function
 * @param {Loops} loops
 * @param {PointSelector} selectJunction
 * @returns {Solid}
 */
export const toSolid = (loops, selectJunction) => {
  const solid = [];

  // Note holes so that we don't try to render them.
  // FIX: Remove this tracking.
  const holes = new Set();
  for (const loop of loops) {
    if (loop.face.holes) {
      for (const hole of loop.face.holes) {
        holes.add(hole.face);
      }
    }
  }

  /**
   * walk
   *
   * @param {Edge} loop
   * @returns {void}
   */
  const walk = (loop) => {
    if (loop === undefined || loop[walked] || loop.face === undefined) return;
    if (holes.has(loop.face)) return;
    eachLink(loop, (link) => { link[walked] = true; });
    eachLink(loop, (link) => walk(link.twin));
    const polygons = [];
    pushConvexPolygons(polygons, loop, selectJunction);
    solid.push(polygons);
  };

  for (const loop of loops) {
    walk(loop);
  }

  return solid;
};

export default toSolid;
