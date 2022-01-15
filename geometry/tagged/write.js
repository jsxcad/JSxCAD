import {
  addPending,
  write as writePath,
  writeNonblocking as writePathNonblocking,
} from '@jsxcad/sys';

import { hash } from './hash.js';
import { store } from './store.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

export const write = async (path, geometry, options) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  const stored = await store(disjointGeometry);
  await writePath(path, stored, options);
  return disjointGeometry;
};

// Generally addPending(write(...)) seems a better option.
export const writeNonblocking = (path, geometry, options) => {
  addPending(write(path, geometry, options));
  return geometry;
  /*
  const disjointGeometry = toDisjointGeometry(geometry);
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  const { stored, wouldBlock } = storeNonblocking(disjointGeometry);
  if (wouldBlock) {
    if (options && options.errorOnMissing === false) {
      return;
    }
    throw wouldBlock;
  }
  try {
    writePathNonblocking(path, stored, options);
  } catch (error) {
    if (!options || options.errorOnMissing === true) {
      throw error;
    }
  }
  return disjointGeometry;
*/
};
