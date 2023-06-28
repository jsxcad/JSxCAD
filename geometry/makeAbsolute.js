import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { makeAbsolute as makeAbsoluteWithCgal } from '@jsxcad/algorithm-cgal';
import { replacer } from './tagged/visit.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const makeAbsolute = (geometry, tags = []) => {
  const inputs = linearize(geometry, filter);
  const outputs = makeAbsoluteWithCgal(inputs);
  return replacer(inputs, outputs)(geometry);
};
