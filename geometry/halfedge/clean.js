/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Loops} Loops
 */

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
    let link = loop;
    do {
      if (link.next === undefined) {
        throw Error(`die: ${link.id} ${link.dead}`);
      }
      if (link.to !== undefined) {
        throw Error(`die: to`);
      }
      if (link.next.twin === link.next.next) {
        // We have found a degenerate spur -- trim it off.
        link.next.cleaned = true;
        link.next.next.cleaned = true;
        link.next = link.next.next.next;
        // Make sure we walk around the loop to this point again,
        // in case this exposed another spur.
        loop = link;
      }
      link.face = loop;
      link = link.next;
    } while (link !== loop);
    return link;
  };

  const cleanedLoops = loops.map(walk);
  return cleanedLoops;
};

export default clean;
