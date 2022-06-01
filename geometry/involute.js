import {
  deletePendingSurfaceMeshes,
  involute as involuteWithCgal,
} from '@jsxcad/algorithm-cgal';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type);

export const involute = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = involuteWithCgal(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
