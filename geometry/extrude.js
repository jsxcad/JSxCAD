import {
  deletePendingSurfaceMeshes,
  extrude as extrudeWithCgal,
} from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost, isTypeVoid } from './tagged/type.js';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid));

export const extrude = (geometry, top, bottom, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter(noVoid), inputs);
  const count = inputs.length;
  inputs.push(top, bottom);
  const outputs = extrudeWithCgal(inputs, count, noVoid);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
