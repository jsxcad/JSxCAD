import { isNotTypeGhost, isTypeVoid } from './tagged/type.js';

import { disjoint as disjointWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || isTypeVoid(geometry));

export const Disjoint = (geometries, { backward, exact }) => {
  const concreteGeometries = geometries.map((geometry) =>
    toConcreteGeometry(geometry)
  );
  const inputs = [];
  for (const concreteGeometry of concreteGeometries) {
    linearize(concreteGeometry, filter, inputs);
  }
  // console.log(`QQ/disjoint/inputs: ${JSON.stringify(inputs)}`);
  const outputs = disjointWithCgal(inputs, backward, exact);
  const disjointGeometries = [];
  const update = replacer(inputs, outputs);
  for (const concreteGeometry of concreteGeometries) {
    disjointGeometries.push(update(concreteGeometry));
  }
  return taggedGroup({}, ...disjointGeometries);
};

export const fit = (geometry, geometries, modes) =>
  Disjoint([...geometries, geometry], modes);

export const fitTo = (geometry, geometries, modes) =>
  Disjoint([geometry, ...geometries], modes);

export const disjoint = (geometry, modes) => Disjoint([geometry], modes);
