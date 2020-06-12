/**
 * @typedef {import("./types").Edge} Edge
 */

/**
 * @typedef {function(Edge): void} Thunk
 * @returns {void}
 */

/* @type {function(Edge, Thunk): void} */

/**
 * eachLink
 *
 * @function
 * @param {Edge} loop
 * @param {Thunk} thunk
 * @returns {void}
 */
export const eachLink = (loop, thunk) => {
  let link = loop;
  do {
    thunk(link);
    if (link.dead === true) {
      throw Error("die/dead");
    }
    if (link.next === undefined) {
      throw Error("die/next");
    }
    link = link.next;
  } while (link !== loop);
};

export default eachLink;
