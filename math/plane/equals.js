/**
 * Compare the given planes for equality
 * @return {boolean} true if planes are equal
 */
export const equals = (a, b) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
