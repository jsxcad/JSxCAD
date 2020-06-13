/**
 * debugLink
 *
 * @function
 * @param {Edge} link
 * @returns {string}
 */
export const debugLink = (link) =>
  `${link.start} -> ${link.next.start} face: ${link.face.id}${
    link.twin ? ' twin' : ''
  }${link.dead ? ' dead' : ''}`;

export default debugLink;
