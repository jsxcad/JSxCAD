import { computeArea } from '@jsxcad/algorithm-cgal';
import { hasNotTypeVoid } from './type.js';
import { linearize } from './linearize.js';

const filter = (geometry) => ['graph', 'polygonsWithHoles'].includes(geometry.type) && hasNotTypeVoid(geometry);

export const measureArea = (geometry) => {
  const linear = [];
  linearize(geometry, filter, linear);
  return computeArea(linear);
};
