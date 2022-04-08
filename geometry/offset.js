import {
  deletePendingSurfaceMeshes,
  offset as offsetWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const offset = (geometry, ...args) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = offsetWithCgal(inputs, ...args);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};
