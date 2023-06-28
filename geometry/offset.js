import { Group } from './Group.js';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { offset as offsetWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const offset = (
  geometry,
  initial = 1,
  { segments = 16, step, limit } = {}
) => {
  const inputs = linearize(geometry, filter);
  const outputs = offsetWithCgal(inputs, initial, step, limit, segments);
  return Group(outputs);
};
