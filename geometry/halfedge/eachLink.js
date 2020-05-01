import { Edge } from './types';

/**
 * @callback Thunk
 * @param {Edge} edge
 * @returns {undefined}
 */

/**
 * eachLink
 *
 * @param {Edge} loop
 * @param {(link: Edge) => void} thunk
 * @returns {void}
 */
export const eachLink = (loop, thunk) => {
  let link = loop;
  do {
    thunk(link);
    if (link.dead === true) { throw Error('die/dead'); }
    if (link.next === undefined) { throw Error('die/next'); }
    link = link.next;
  } while (link !== loop);
};

export default eachLink;
