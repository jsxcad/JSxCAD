/* @module */

import { Edge, Loops, PointSelector, Solid } from './types';

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
 * @param {Loops} loops
 * @param {PointSelector} selectJunction
 * @returns {Solid}
 */
export const toSolid = (loops, selectJunction) => {
  const solid = [];

  /**
   * walk
   *
   * @param {Edge} loop
   * @returns {void}
   */
  const walk = (loop) => {
    if (loop === undefined || loop[walked] || loop.face === undefined) return;
    eachLink(loop, (link) => { link[walked] = true; });
    eachLink(loop, (link) => walk(link.twin));
    const polygons = [];
    pushConvexPolygons(polygons, loop, selectJunction);
    // pushPolygon(polygons, loop);
    solid.push(polygons);
  };

  walk(loops[0]);

  return solid;
};

export default toSolid;
