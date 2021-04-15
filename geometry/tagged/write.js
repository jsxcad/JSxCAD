import { hash } from './hash.js';
import { prepareForSerialization } from './prepareForSerialization.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';
import { write as writePath } from '@jsxcad/sys';

export const write = async (geometry, path) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  const preparedGeometry = prepareForSerialization(disjointGeometry);
  await writePath(path, preparedGeometry);
  return preparedGeometry;
};
