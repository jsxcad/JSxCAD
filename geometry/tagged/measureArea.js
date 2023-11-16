import { computeArea } from '@jsxcad/algorithm-cgal';
import { isNotTypeVoid } from './type.js';
import { linearize } from './linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const measureArea = (geometry) => {
  const linear = [];
  linearize(geometry, filter, linear);
  return computeArea(linear);
};
