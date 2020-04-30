/**
 * eachLink
 *
 * @param loop
 * @param thunk
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
