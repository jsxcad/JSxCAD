/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toDot } from './toDot';
import { toPlane } from './toPlane';

/**
 * clean
 *
 * @function
 * @param {Loops} loops
 * @returns {Loops}
 */
export const clean = (loops) => {
  /**
   * walk
   *
   * @param {Edge} loop
   * @param {number} nth
   * @returns {Edge}
   */
  const walk = (loop, nth) => {
    console.log(``);
    console.log(`walk: ${loop.id} ${loop.dead} ${loop.to}`);
    let link = loop;
    do {
      if (link.next === undefined) {
        throw Error(`die: ${link.id} ${link.dead}`);
      }
      if (link.to !== undefined) {
        throw Error(`die: to`);
      }
      if (link.next.twin === link.next.next) {
        console.log(`QQ/clean/trim`);
        console.log(toDot([link]));
        // We have found a degenerate spur -- trim it off.
        link.next.cleaned = true;
        link.next.next.cleaned = true;
        link.next = link.next.next.next;
        // Make sure we walk around the loop to this point again,
        // in case this exposed another spur.
        console.log(`QQ/clean/trim/after`);
        console.log(toDot([link]));
        loop = link;
      }
      link.face = loop;
      link = link.next;
      console.log(`loop: ${loop.id} ${loop.dead} ${loop.zapped} ${loop.cleaned} face ${loop.face.id}`);
      console.log(`link: ${link.id} ${link.dead} ${link.zapped} ${link.cleaned} face ${link.face.id}`);
    } while (link !== loop);
    return link;
  };

  const cleanedLoops = loops.map(walk);
  return cleanedLoops;
};

export default clean;
