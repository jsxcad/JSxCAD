import {
  deletePendingSurfaceMeshes,
  simplify as simplifyWithCgal,
} from '@jsxcad/algorithm-cgal';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const simplify = (geometry, ratio, simplifyPoints, eps) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = simplifyWithCgal(inputs, ratio, simplifyPoints, eps);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
