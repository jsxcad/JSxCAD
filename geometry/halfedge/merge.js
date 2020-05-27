/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

// Note that merging produces duplicate points.

import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
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
      if (link.face !== link.next.face) {
        throw Error('die');
      }
      const twin = link.twin;
      // Ensure face cohesion.
      if (twin === undefined) {
        // Do nothing.
      } else if (twin.face === link.face) {
        // Do nothing.
      } else if (link.next === twin) {
        // Do nothing.
      } else if (equalsPlane(toPlane(link), toPlane(twin))) {
        // Merge the loops.
        const linkNext = link.next;
        const twinNext = twin.next;

        if (linkNext.dead) throw Error('die');
        if (twinNext.dead) throw Error('die');
        if (twin.twin !== link) throw Error('die');

        if (twinNext === link) throw Error('die');
        if (linkNext === twin) throw Error('die');

        link.twin = undefined;
        twin.twin = undefined;

        Object.assign(link, twinNext);
        link.from = twinNext;
        twinNext.to = link;

        Object.assign(twin, linkNext);
        twin.from = linkNext;
        linkNext.to = twin;

        if (link.twin) { link.twin.twin = link; }
        if (twin.twin) { twin.twin.twin = twin; }

        if (twin.next === twin) throw Error('die');

        linkNext.face = undefined;
        linkNext.next = undefined;
        linkNext.twin = undefined;
        linkNext.dead = true;
        linkNext.id -= 1000000;

        twinNext.face = undefined;
        twinNext.next = undefined;
        twinNext.twin = undefined;
        twinNext.dead = true;
        twinNext.id -= 1000000;

        // Ensure we do a complete pass over the merged loop.
        loop = link;

        // Update face affinity to detect self-merging.
        do {
          link.face = loop;
          link = link.next;
        } while (link !== loop);
      }
      if (link.next === undefined) { throw Error('die'); }
      link = link.next;
      if (link.to !== undefined) { throw Error('die'); }
    } while (link !== loop);
    while (link !== link.face) link = link.face;
    return link.face;
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

  const seen = new Set();
  const filtered = [];
  for (const loop of loops.map(walk)) {
    if (loop === undefined) continue;
    if (loop.next === undefined) continue;
    if (loop.face === undefined) continue;
    if (loop.dead !== undefined) continue;
    let link = loop;
    do {
      if (link.face.id !== loop.face.id) throw Error('die');
      link = link.next;
    } while (link !== loop);
    if (seen.has(loop.face)) {
      // faces aren't loop-unique.
      // throw Error('die');
    } else {
      seen.add(loop.face);
      // We're getting the wrong ones in here, sometimes.
      filtered.push(loop);
    }
  }
  return filtered;
};

export default merge;
