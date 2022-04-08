import {
  deletePendingSurfaceMeshes,
  outline as outlineWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const outline = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = outlineWithCgal(inputs);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
