import { eachItem } from './eachItem.js';

/**
 * Returns the first orientation peg found, or defaults to Z0.
 */

export const getPeg = (geometry) => {
  let peg;
  eachItem(geometry, (item) => {
    if (item.type === 'points' && item.tags && item.tags.includes('peg')) {
      if (peg === undefined) {
        peg = item.points[0];
      }
    }
  });
  return peg || [0, 0, 0, 0, 0, 1];
};
