import { eagerTransform as eagerTransformWithCgal } from '@jsxcad/algorithm-cgal';
import { hasTypeReference } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';

const filterTargets = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

// CHECK: We should pass in reference geometry rather than a matrix.
export const eagerTransform = (geometry, matrix, { noVoid } = {}) => {
  const inputs = linearize(geometry, filterTargets(noVoid));
  const count = inputs.length;
  inputs.push(hasTypeReference(taggedGroup({ matrix })));
  const outputs = eagerTransformWithCgal(inputs);
  return replacer(inputs, outputs, count)(geometry);
};
