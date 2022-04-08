import {
  cast as castWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const cast = (geometry, reference) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = castWithCgal(inputs, reference);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};
