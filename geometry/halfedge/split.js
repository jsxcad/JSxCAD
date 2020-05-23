/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toDot } from './toDot';
import { toPlane } from './toPlane';

const splitted = Symbol('splitted');

const assertGood = (loop) => {
  let link = loop;
  let nth = 0;
  do {
    if (link.twin) {
      if (link.twin.start !== link.next.start) throw Error('die');
      if (link.twin.next.start !== link.start) throw Error('die');
      if (link.twin.face.holes) {
        for (const hole of link.twin.face.holes) {
          if (hole.dead) {
            // throw Error('die');
            console.log(`QQ/link.twin.face.holes[].dead`);
          }
        }
      }
    }
    if (link.dead) {
      throw Error(`die: ${nth}`);
    }
    if (link.holes) {
      for (const hole of link.holes) {
        if (hole.dead) throw Error('die');
      }
    }
    if (link.face.holes) {
      for (const hole of link.face.holes) {
        if (hole.dead) throw Error('die');
      }
    }
    link = link.next;
    nth += 1;
  } while (link !== loop);
}

/**
 * split
 *
 * @function
 * @param {Loops} loops
 * @returns {Loops}
 */
export const split = (loops) => {
  // console.log(`QQ/split`);
  // console.log(toDot(loops));
  /**
   * walk
   *
   * @param {Edge} loop
   * @param {number} nth
   * @returns {Edge}
   */
  const walk = (loop, nth) => {
    // console.log(`QQ/walk/loop: ${loop.start}`);
    // console.log(`QQ/walk/nth: ${nth}`);
    if (loop[splitted] || loop.next === undefined) return;
    eachLink(loop, link => { link[splitted] = true; console.log([link.id, link.start]); });
    let link = loop;
    do {
      assertGood(link);
      console.log(`QQ/id: ${link.id} face ${link.face.id}`);
      const twin = link.twin;
      if (twin === undefined || twin.face !== link.face) {
        // Nothing to do.
      } else if (twin.next.next === link.next) {
        // Do nothing for now.
        //
        // We started in the middle of a spur, leave it to be fixed when we
        // roll around to the start of the spur.
      } else {
        assertGood(link);
        // Found a self-linkage.
        // console.log(`QQ/walk/twin: ${link.twin.start}`);
        if (link.twin === link) throw Error('die');
        if (twin.twin !== link) throw Error('die');
        const linkPlane = toPlane(link);
        const linkNext = link.next;
        const twinNext = twin.next;
        // if (linkNext === twin) throw Error('die: linkNext === twin');
        if (twinNext.next === linkNext) throw Error('die: twinNext === linkNext');
        const spurLinkage = (twin === linkNext);
        loop = link;
        if (linkNext.dead) throw Error('die');
        if (twinNext.dead) throw Error('die');
        link.twin = undefined;
        Object.assign(link, twinNext);
        if (twinNext === linkNext) throw Error('die');
        if (link.next === linkNext) throw Error('die');
        twin.twin = undefined;
        assertGood(link);
        if (!spurLinkage) {
// console.log(`QQ/spur/no`);
          Object.assign(twin, linkNext);
        } else {
// console.log(`QQ/spur/yes`);
          link.spurLinkage = true;
        }
        if (link.twin) { link.twin.twin = link; }
        if (twin.twin) { twin.twin.twin = twin; }
        if (twin.next === twin) throw Error('die');
        linkNext.next = undefined;
        linkNext.twin = undefined;
        linkNext.dead = true;
        if (link.next === linkNext) throw Error('die');
        // twinNext.next = undefined;
        // twinNext.twin = undefined;
        // twinNext.dead = true;
        if (spurLinkage) {
console.log(`QQ/spur`);
          twin.twin = undefined;
          assertGood(link);
        // No more to do -- the half-linkage above was sufficient. Carry on.
        } else {
          assertGood(link);
console.log(`QQ/hole/yes`);
        // One loop was merged with itself, producing a hole.
          twin.face = undefined;
          assertGood(link);
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
console.log(`QQ/degenerate/link`);
            // Discard the current loop and switch to the twin.
            loop = twin;
            link = twin;
          } else if (newTwinPlane === undefined) {
console.log(`QQ/degenerate/twin`);
            // Nothing to do -- discard it.
          // Extend and assign the holes.
          } else if (equalsPlane(linkPlane, newLinkPlane)) {
            assertGood(link);
console.log(`QQ/island/twin`);
          // The twin loop is the island.
            if (equalsPlane(linkPlane, newTwinPlane)) {
              throw Error('die');
            }
            if (twin.dead) throw Error('die');
            // holes.push(twin); // RESTORE
            link.holes = holes;
            twin.holes = undefined;
          } else {
            assertGood(link);
console.log(`QQ/island/link`);
          // The link loop is the island.
            if (equalsPlane(linkPlane, newLinkPlane)) {
              console.log(`QQ/link`);
              console.log(toDot(link));
              console.log(`QQ/twin`);
              console.log(toDot(twin));
              throw Error('die');
            }
            if (link.dead) throw Error('die');
            // holes.push(link); // RESTORE
            twin.holes = holes;
            link.holes = undefined;
          }
          // TODO: Prove there are no twins in the hole, and continue traversing the non-hole.
        }
      }
      assertGood(link);
      if (link.next === undefined) { throw Error('die'); }
      link = link.next;
      // console.log(toDot(loops));
    } while (link !== loop);
    while (link !== link.face) link = link.face;
    return link;
  };

  for (const loop of loops) {
    assertGood(loop);
  }

  const splitLoops = loops.map(walk);

  for (const loop of splitLoops) {
    if (loop && !loop.dead) {
      assertGood(loop);
    }
  }

  const filteredLoops = splitLoops.filter(loop => loop && loop.next && !loop.dead);
  return filteredLoops;
};

export default split;
