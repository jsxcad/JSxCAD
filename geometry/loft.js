import {
  loft as loftWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const loft = (geometries) => {
  const inputs = [];
  // This is wrong -- we produce a total linearization over geometries,
  // but really it should be partitioned.
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter, inputs);
  }
  const outputs = loftWithCgal(inputs);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};
