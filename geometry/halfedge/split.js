/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

import { clean } from './clean';
import { eachLink } from './eachLink';
import { equalsPlane } from './junction';
import { toPlane } from './toPlane';

/**
 * walk
 *
 * @param {Edge} loop
 * @param holes
 * @returns {Edge}
 */
export const splitBridges = (uncleanedLoop, holes) => {
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
  /**
   * walk
   *
   * @param {Edge} loop
   * @param isHole
   * @returns {Edge}
   */
  const walk = (loop, isHole = false) => {
    let link = loop;
    do {
      let twin = link.twin;
      if (twin === undefined || twin.face !== link.face) {
        // Nothing to do.
      } else if (twin.next.next === link.next) {
        // The bridge is going backward -- catch it on the next cycle.
        loop = link;
      } else if (twin === link.next) {
        // Spur
        throw Error('die/spur1');
      } else if (twin.next === link) {
        // Spur
        throw Error('die/spur2');
      } else {
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

        // Now that the loops are separated, clean up any residual canals.
        link = clean(link);
        twin = clean(twin);

        // Check the orientations to see which is the hole.
        const newLinkPlane = toPlane(link, /* recompute= */true);
        const newTwinPlane = toPlane(twin, /* recompute= */true);

        if (newLinkPlane === undefined) {
          // The link loop is a degenerate hole.
          // This is probably nibbling away at the end of a canal.
          twin.face.holes = holes;
          loop = link = twin;
        } else if (newTwinPlane === undefined) {
          // The twin loop is a degenerate hole.
          // This is probably nibbling away at the end of a canal.
          link.face.holes = holes;
          loop = link;
        } else if (equalsPlane(linkPlane, newLinkPlane)) {
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
