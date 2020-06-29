import './types';

/**
 * @typedef {function(Edge):undefined} Thunk
 * @returns {undefined}
 */

/* @type {function(Edge, Thunk):undefined} */

/**
 * eachLink
 *
 * @function
 * @param {Edge} loop
 * @param {Thunk} thunk
 * @returns {undefined}
 */
export const eachLink = (loop, thunk) => {
  let link = loop;
  do {
    thunk(link);
    if (link.dead === true) {
      throw Error('die/dead');
    }
    if (link.next === undefined) {
      throw Error('die/next');
    }
    link = link.next;
  } while (link !== loop);
};

export default eachLink;
