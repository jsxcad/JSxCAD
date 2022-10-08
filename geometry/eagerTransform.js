import {
  deletePendingSurfaceMeshes,
  eagerTransform as eagerTransformWithCgal,
} from '@jsxcad/algorithm-cgal';
import { hasTypeReference, isNotTypeGhost, isTypeVoid } from './tagged/type.js';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterTargets = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

// CHECK: We should pass in reference geometry rather than a matrix.
export const eagerTransform = (matrix, geometry, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets(noVoid), inputs);
  const count = inputs.length;
  inputs.push(hasTypeReference(taggedGroup({ matrix })));
  const outputs = eagerTransformWithCgal(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};
