import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { loft as loftWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const Loft = (geometries, { open = false }) => {
  const inputs = [];
  // This is wrong -- we produce a total linearization over geometries,
  // but really it should be partitioned.
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter, inputs);
  }
  const outputs = loftWithCgal(inputs, !open);
  return taggedGroup({}, ...outputs);
};

export const loft = (geometry, geometries, mode) =>
  Loft([geometry, ...geometries], mode);
