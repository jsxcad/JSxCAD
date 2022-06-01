import {
  deletePendingSurfaceMeshes,
  smooth as smoothWithCgal,
} from '@jsxcad/algorithm-cgal';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const smooth = (geometry, selections, iterations, time) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter, inputs);
  }
  const outputs = smoothWithCgal(inputs, count, iterations, time);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
