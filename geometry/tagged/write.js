import { addPending, write as writePath } from '@jsxcad/sys';

import { hash } from './hash.js';
import { store } from './store.js';

export const write = async (path, geometry, options) => {
  console.log(`QQ/geometry/write`);
  // Ensure that the geometry carries a hash before saving.
  hash(geometry);
  const stored = await store(geometry);
  await writePath(path, stored, options);
  return geometry;
};

// Generally addPending(write(...)) seems a better option.
export const writeNonblocking = (path, geometry, options) => {
  console.log(`QQ/geometry/writeNonblocking`);
  addPending(write(path, geometry, options));
  return geometry;
};
