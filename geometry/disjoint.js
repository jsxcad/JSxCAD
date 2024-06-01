import { isNotTypeGhost, isTypeVoid } from './tagged/type.js';

import { Group } from './Group.js';
import { disjoint as disjointWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || isTypeVoid(geometry));

export const Disjoint = (geometries, { exact } = {}) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = disjointWithCgal(inputs, exact);
  const disjointGeometries = [];
  const update = replacer(inputs, outputs);
  for (const geometry of geometries) {
    disjointGeometries.push(update(geometry));
  }
  return Group(disjointGeometries);
};

export const fit = (geometry, geometries, modes) =>
  Disjoint([...geometries, geometry], modes);

export const fitTo = (geometry, geometries, modes) =>
  Disjoint([geometry, ...geometries], modes);

export const disjoint = (geometry, modes) => Disjoint([geometry], modes);
