import { Group } from './Group.js';
import { gap } from './gap.js';
import { hasTypeMasked } from './tagged/type.js';

export const masking = (mask, masked) =>
  Group([gap(mask), hasTypeMasked(masked)]);
