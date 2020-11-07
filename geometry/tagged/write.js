import { hash } from './hash.js';
import { realize } from './realize.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';
import { write as writePath } from '@jsxcad/sys';

export const write = async (geometry, path) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  // Ensure that the geometry carries a hash before saving.
  hash(disjointGeometry);
  const realizedGeometry = realize(disjointGeometry);
  await writePath(path, realizedGeometry);
  return realizedGeometry;
};
