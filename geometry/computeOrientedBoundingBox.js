import { computeOrientedBoundingBox as computeOrientedBoundingBoxWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  isNotTypeGhost(geometry) &&
  ((geometry.type === 'graph' && !geometry.graph.isEmpty) ||
    ['polygonsWithHoles', 'segments', 'points'].includes(geometry.type));

export const computeOrientedBoundingBox = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = computeOrientedBoundingBoxWithCgal(inputs);
  return outputs[0];
};
