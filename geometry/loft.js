import { Group } from './Group.js';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { loft as loftWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const Loft = (geometries, { open = false }) => {
  const inputs = [];
  // This is wrong -- we produce a total linearization over geometries,
  // but really it should be partitioned.
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = loftWithCgal(inputs, !open);
  return Group(outputs);
};

export const loft = (geometry, geometries, mode) =>
  Loft([geometry, ...geometries], mode);
