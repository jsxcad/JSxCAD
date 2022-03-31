import {
  bend as bendWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeMasked } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const bend = (geometry, radius) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = bendWithCgal(inputs, radius);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
