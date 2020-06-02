/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

import { clean } from './clean';
import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toPlane } from './toPlane';
import { toDot } from './toDot';
import { toPolygons } from './toPolygons';

/**
 * walk
 *
 * @param {Edge} loop
 * @param holes
 * @returns {Edge}
 */
export const splitBridges = (uncleanedLoop, holes) => {
console.log(`QQ/splitBridges: ${toDot([uncleanedLoop])}`);
  const loop = clean(uncleanedLoop);
  if (loop.face.holes) { throw Error('die'); }
  let link = loop;
  do {
    if (link.holes) { throw Error('die'); }
    const twin = link.twin;
    if (twin === undefined || twin.face !== link.face) {
      // Nothing to do.
    } else if (twin.next.next === link.next) {
      // The twin links backward along a spur.
      // These should have been removed in the cleaning phase.
      // throw Error(`die: ${toDot([link])}`);
      throw Error(`die: ${link.face.id}`);
    } else if (link.next === twin) {
      // Spur
      throw Error('die');
    } else {
      // Found a self-linkage.
      if (twin === link) throw Error('die');
      if (twin.twin !== link) throw Error('die');
      const linkPlane = toPlane(link);
      const linkNext = link.next;
      const twinNext = twin.next;
      link.twin = undefined;
      Object.assign(link, twinNext);
      twin.twin = undefined;
      Object.assign(twin, linkNext);

      if (link.twin) { link.twin.twin = link; }
      if (twin.twin) { twin.twin.twin = twin; }

      // One loop was merged with itself, producing a new hole.
      // But we're not sure which loop is the hole and which is the loop around the hole.

      // Elect new faces.
      eachLink(link, edge => { edge.face = link; });
      eachLink(twin, edge => { edge.face = twin; });

      // Check the orientations to see which is the hole.
      const newLinkPlane = toPlane(link, /* recompute= */true);
      const newTwinPlane = toPlane(twin, /* recompute= */true);

      if (newLinkPlane === undefined) {
        throw Error('die');
      } else if (newTwinPlane === undefined) {
        throw Error('die');
      } else if (equalsPlane(linkPlane, newLinkPlane)) {
      // The twin loop is the hole.
        if (!equalsPlane(linkPlane, newTwinPlane)) {
          // But they have the same orientation, which means that it isn't a bridge,
          throw Error('die');
        }
        splitBridges(link, holes);
        splitBridges(twin, holes);
      } else {
      // The link loop is the hole.
        if (!equalsPlane(linkPlane, newLinkPlane)) {
          // But they have the same orientation, which means that it isn't a hole,
          // but a region connected by a degenerate bridge.
          throw Error('die');
        }
        splitBridges(link, holes);
        splitBridges(twin, holes);
      }
      // We've delegated hole collection.
      return;
    }
    link = link.next;
  } while (link !== loop);

  holes.push(link.face);
};

/**
 * split
 *
 * @function
 * @param {Loops} loops
 * @returns {Loops}
 */
export const split = (loops) => {
console.log(`QQ/split`);
console.log(`QQ/split/dot: ${toDot(loops)}`);
  /**
   * walk
   *
   * @param {Edge} loop
   * @param isHole
   * @returns {Edge}
   */
  const walk = (loop, isHole = false) => {
console.log(`QQ/split/walk: ${loop.face.id}`);
console.log(toPolygons([loop]));
console.log(toDot([loop]));
    let link = loop;
    do {
      const twin = link.twin;
      if (twin === undefined || twin.face !== link.face) {
        // Nothing to do.
      } else if (twin.next.next === link.next) {
        throw Error('die');
      } else if (twin === link.next) {
        // Spur
        throw Error('die');
      } else if (twin.next === link) {
        // Spur
        throw Error('die');
      } else {
console.log(`QQ/split/base: ${link.id}`);
console.log(toPolygons([link]));
console.log(toDot([link]));
        // Remember any existing holes, when the face migrates.
        const holes = link.face.holes || [];
        link.face.holes = undefined;

        // Found a self-linkage.
        if (twin === link) throw Error('die');
        if (twin.twin !== link) throw Error('die');
        const linkPlane = toPlane(link);
        const linkNext = link.next;
        const twinNext = twin.next;
        link.twin = undefined;
        Object.assign(link, twinNext);
        twin.twin = undefined;
        Object.assign(twin, linkNext);

        if (link.twin) { link.twin.twin = link; }
        if (twin.twin) { twin.twin.twin = twin; }

        // One loop was merged with itself, producing a new hole.
        // But we're not sure which loop is the hole and which is the loop around the hole.

        // Elect new faces.
        eachLink(link, edge => { edge.face = link; });
        eachLink(twin, edge => { edge.face = twin; });

console.log(`QQ/split/link`);
console.log(toPolygons([link]));
console.log(toDot([link]));

console.log(`QQ/split/twin`);
console.log(toPolygons([twin]));
console.log(toDot([twin]));

console.log(`QQ/split/holes`);
console.log(toPolygons(holes));
console.log(toDot(holes));

        // Check the orientations to see which is the hole.
        const newLinkPlane = toPlane(link, /* recompute= */true);
        const newTwinPlane = toPlane(twin, /* recompute= */true);

        if (newLinkPlane === undefined) {
          // The link loop is a degenerate hole.
          twin.face.holes = holes;
          loop = link = twin;
        } else if (newTwinPlane === undefined) {
          // The twin loop is a degenerate hole.
          link.face.holes = holes;
          loop = link;
        } else if (equalsPlane(linkPlane, newLinkPlane)) {
console.log(`QQ/split/twin-is-hole`);
        // The twin loop is the hole.
          if (equalsPlane(linkPlane, newTwinPlane)) {
            // But they have the same orientation, which means that it isn't a hole,
            // but a region connected by a degenerate bridge.
            throw Error('die');
          }
          splitBridges(twin, holes);
          link.face.holes = holes;
          loop = link;
        } else {
console.log(`QQ/split/link-is-hole`);
        // The link loop is the hole.
          if (equalsPlane(linkPlane, newLinkPlane)) {
            // But they have the same orientation, which means that it isn't a hole,
            // but a region connected by a degenerate bridge.
            throw Error('die');
          }
          splitBridges(link, holes);
          twin.face.holes = holes;
          // Switch to traversing the non-hole portion of the loop.
          loop = link = twin;
        }
      }
      link = link.next;
    } while (link !== loop);
    return link.face;
  };

  const splitLoops = loops.map(walk);

  return splitLoops;
};

export default split;
