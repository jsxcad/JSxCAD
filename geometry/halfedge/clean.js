import './types.js';

/**
 * clean
 * @param {Edge} loop
 * @returns {Edge|undefined}
 */
export const clean = (loop) => {
  /** @type {Edge} */
  let link = loop;
  do {
    if (link.start === false) {
      throw Error(`die: start is false`);
    }
    if (link.next === undefined) {
      throw Error(`die: ${link.id} ${link.dead}`);
    }
    if (link.to !== undefined) {
      throw Error(`die: to`);
    }
    if (link.next.twin === link.next.next) {
      if (link.next === link.next.next.next) {
        // The loop is degenerate.
        return undefined;
      }
      // We have found a degenerate spur -- trim it off.
      link.next.cleaned = true;
      link.next.next.cleaned = true;
      link.next = link.next.next.next;
      // Make sure we walk around the loop to this point again,
      // in case this exposed another spur.
      loop = link;
    }
    link = link.next;
    link.face = loop;
  } while (link !== loop);

  // Check that the spurs are gone.
  let violations = 0;
  do {
    const twin = link.twin;
    if (twin === undefined || twin.face !== link.face) {
      // Nothing to do.
    } else if (twin.next.next === link.next) {
      // The twin links backward along a spur.
      // These should have been removed in the cleaning phase.
      violations += 1;
    }
    link = link.next;
  } while (link !== loop);

  if (violations > 0) {
    throw Error(`die: ${violations}`);
  }
  return link.face;
};

export default clean;
