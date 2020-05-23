/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

// Note that merging produces duplicate points.

import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toDot } from './toDot';
import { toPlane } from './toPlane';

const merged = Symbol('merged');

/**
 * merge
 *
 * @function
 * @param {Loops} loops
 * @returns {Loops}
 */
export const merge = (loops) => {
  /**
   * walk
   *
   * @param {Edge} loop
   * @returns {Edge}
   */
  const walk = (loop) => {
    if (loop[merged] || loop.next === undefined) return;
    eachLink(loop, link => { link[merged] = true; });
    let link = loop;
    do {
      if (link.twin && link.twin.face !== link.face) {
        const twin = link.twin;
        if (twin.twin !== link) throw Error('die');
        const linkPlane = toPlane(link);
        const twinPlane = toPlane(twin);
        if (equalsPlane(linkPlane, twinPlane)) {
          const linkNext = link.next;
          const twinNext = twin.next;
          const spurLinkage = (twin === linkNext);
          loop = link;
          if (linkNext.dead) throw Error('die');
          if (twinNext.dead) throw Error('die');
          link.twin = undefined;
          Object.assign(link, twinNext);
          twin.twin = undefined;
          if (!spurLinkage) {
            Object.assign(twin, linkNext);
          } else {
            link.spurLinkage = true;
          }
          if (link.twin) { link.twin.twin = link; }
          if (twin.twin) { twin.twin.twin = twin; }
          if (twin.next === twin) throw Error('die');
          linkNext.next = undefined;
          linkNext.twin = undefined;
          linkNext.dead = true;
          if (!spurLinkage) {
            twinNext.next = undefined;
            twinNext.twin = undefined;
            twinNext.dead = true;
          }
          if (spurLinkage) {
          // No more to do -- the half-linkage above was sufficient. Carry on.
          } else {
          // Two separate loops were merged, update face affinity.
            link.plane = undefined;
            eachLink(link, edge => { edge.face = link; });
          }
        }
      }
      if (link.next === undefined) { throw Error('die'); }
      link = link.next;
    } while (link !== loop);
    while (link !== link.face) link = link.face;
    return link;
  };

  for (const loop of loops) {
    let link = loop;
    do {
      if (link.twin) {
        if (link.twin.start !== link.next.start) throw Error('die');
        if (link.twin.next.start !== link.start) throw Error('die');
      }
      if (link.dead) {
        throw Error('die');
      }
      link = link.next;
    } while (link !== loop);
  }
  return loops.map(walk).filter(loop => loop && loop.next && !loop.dead);
};

export default merge;
