import { isNotTypeGhost, isNotTypeVoid } from './tagged/type.js';

import { Group } from './Group.js';
import { iron as ironWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

const ironImpl = (geometry, turn = 1) => {
  const inputs = [];
  linearize(geometry, filter, inputs);
  const outputs = ironWithCgal(inputs, turn);
  return replacer(inputs, outputs)(geometry);
};

export const iron = (geometry, turn = 1, geometries) =>
  ironImpl(Group([geometry, ...geometries]), turn);

export const Iron = (geometries, turn = 1) => ironImpl(Group(geometries), turn);
