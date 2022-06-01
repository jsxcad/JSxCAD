import {
  deletePendingSurfaceMeshes,
  eachPoint as eachPointWithCgal,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeVoid(geometry);

export const eachPoint = (geometry, emit) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  eachPointWithCgal(inputs, emit);
  deletePendingSurfaceMeshes();
};
