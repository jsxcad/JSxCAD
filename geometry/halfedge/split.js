/** @module @jsxcad/geometry-halfedge/split */

/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toDot } from './toDot';
import { toPlane } from './toPlane';

const splitted = Symbol('splitted');

/**
 * split
 *
 * @function
 * @param {Loops} loops
 * @returns {Loops}
 */
export const split = (loops) => {
  console.log(toDot(loops));
  /**
   * walk
   *
   * @param {Edge} loop
   * @param {number} nth
   * @returns {Edge}
   */
  const walk = (loop, nth) => {
    console.log(`QQ/walk/loop: ${loop.start}`);
    console.log(`QQ/walk/nth: ${nth}`);
    if (loop[splitted] || loop.next === undefined) return;
    eachLink(loop, link => { link[splitted] = true; console.log([link.id, link.start]); });
    let link = loop;
    do {
      console.log(`QQ/id: ${link.id} face ${link.face.id}`);
      if (link.twin && link.twin.face === link.face) {
        // Found a self-linkage.
        const twin = link.twin;
        console.log(`QQ/walk/twin: ${link.twin.start}`);
        if (twin.twin !== link) throw Error('die');
        const linkPlane = toPlane(link);
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
console.log(`QQ/spur/no`);
          Object.assign(twin, linkNext);
        } else {
console.log(`QQ/spur/yes`);
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
console.log(`QQ/hole/yes`);
        // One loop was merged with itself, producing a hole.
          twin.face = undefined;
          eachLink(link, edge => { edge.face = link.face; });

          const holes = link.face.holes || [];
          // The loop was split into a ring with an island inside.
          // But we're not sure which loop is which or which side the loop face ended up on.
          // Elect new faces.
console.log(`QQ/elect/link: ${link.id}`);
          eachLink(link, edge => { edge.face = link; });
console.log(`QQ/elect/twin: ${twin.id}`);
          eachLink(twin, edge => { edge.face = twin; });
          const newLinkPlane = toPlane(link, /* recompute= */true);
          const newTwinPlane = toPlane(twin, /* recompute= */true);
          // CHECK: Are these sufficient to detect a spur collapse?
          if (newLinkPlane === undefined) {
            throw Error('die/link');
          }
          if (newTwinPlane === undefined) {
            throw Error('die/twin');
          }
          // Extend and assign the holes.
          if (equalsPlane(linkPlane, newLinkPlane)) {
console.log(`QQ/island/twin`);
          // The twin loop is the island.
            if (equalsPlane(linkPlane, newTwinPlane)) {
              throw Error('die');
            }
            holes.push(twin);
            link.holes = holes;
            twin.holes = undefined;
          } else {
console.log(`QQ/island/link`);
          // The link loop is the island.
            if (equalsPlane(linkPlane, newLinkPlane)) {
              throw Error('die');
            }
            holes.push(link);
            twin.holes = holes;
            link.holes = undefined;
          }
          // TODO: Prove there are no twins in the hole, and continue traversing the non-hole.
        }
      }
      if (link.next === undefined) { throw Error('die'); }
      link = link.next;
      console.log(toDot(loops));
    } while (link !== loop);
    while (link !== link.face) link = link.face;
    return link;
  };
  return loops.map(walk);
};

export default split;
