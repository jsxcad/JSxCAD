import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { getLeafs } from './tagged/getLeafs.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { transform } from './transform.js';

export const by = (geometry, selections) => {
  const placed = [];
  for (const selection of selections) {
    for (const leaf of getLeafs(selection)) {
      const { global } = getInverseMatrices(leaf);
      // Perform the operation then place the
      // result in the global frame of the reference.
      placed.push(transform(global, geometry));
    }
  }
  return taggedGroup({}, ...placed);
};
