import {
  deform as deformWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterShape = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterSelection = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

const filterDeformation = (geometry) =>
  ['graph', 'polygonsWithHoles', 'points', 'segments'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const deform = (geometry, entries, iterations, tolerance, alpha) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterShape, inputs);
  const length = inputs.length;
  let end = length;
  for (const { selection, deformation } of entries) {
    // This is fragile, since we assume there are strict pairs of selections and
    // deformations.
    linearize(toConcreteGeometry(selection), filterSelection, inputs);
    if (inputs.length !== end + 1) {
      throw Error(`Too many selections`);
    }
    end += 1;
    linearize(toConcreteGeometry(deformation), filterDeformation, inputs);
    if (inputs.length !== end + 1) {
      throw Error(`Too many deformations`);
    }
    end += 1;
  }
  const outputs = deformWithCgal(inputs, length, iterations, tolerance, alpha);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, length)(concreteGeometry);
};
