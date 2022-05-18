import {
  deletePendingSurfaceMeshes,
  extrude as extrudeWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const extrude = (geometry, top, bottom) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const count = inputs.length;
  inputs.push(top, bottom);
  const outputs = extrudeWithCgal(inputs, count);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
