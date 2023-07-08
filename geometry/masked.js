import { Group } from './Group.js';
import { gap } from './gap.js';
import { hasTypeMasked } from './tagged/type.js';

export const masked = (geometry, masks) => {
  const gaps = [];
  for (const mask of masks) {
    gaps.push(gap(mask));
  }
  return Group([...gaps, hasTypeMasked(geometry)]);
};
