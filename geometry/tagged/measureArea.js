import { computeArea } from '@jsxcad/algorithm-cgal';
import { linearize } from './linearize.js';

export const measureArea = (geometry) => {
  const linear = [];
  linearize(geometry, ['graph', 'polygonsWithHoles'], linear);
  return computeArea(linear);
};
