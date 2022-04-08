import {
  deletePendingSurfaceMeshes,
  section as sectionWithCgal,
} from '@jsxcad/algorithm-cgal';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterInputs = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

export const section = (inputGeometry, referenceGeometries) => {
  const concreteGeometry = toConcreteGeometry(inputGeometry);
  const inputs = [];
  linearize(concreteGeometry, filterInputs, inputs);
  const count = inputs.length;
  const references = [];
  for (const referenceGeometry of referenceGeometries) {
    linearize(referenceGeometry, filterReferences, references);
  }
  const outputs = sectionWithCgal(inputs, references);
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs, count)(concreteGeometry);
};
