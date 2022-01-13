import { store, storeNonblocking } from './store.js';

import {
  write as writePath,
  writeNonblocking as writePathNonblocking,
} from '@jsxcad/sys';

import { hash } from './hash.js';
import { prepareForSerialization } from './prepareForSerialization.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

export const write = async (path, geometry) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  const preparedGeometry = prepareForSerialization(disjointGeometry);
  const stored = await store(preparedGeometry);
  await writePath(path, stored);
  return preparedGeometry;
};

export const writeNonblocking = (path, geometry) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  const preparedGeometry = prepareForSerialization(disjointGeometry);
  const { stored, wouldBlock } = storeNonblocking(preparedGeometry);
  writePathNonblocking(path, stored);
  if (wouldBlock) {
    throw wouldBlock;
  }
  return preparedGeometry;
};
