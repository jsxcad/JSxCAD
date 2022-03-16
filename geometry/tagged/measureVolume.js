import { computeVolume } from '@jsxcad/algorithm-cgal';
import { linearize } from './linearize.js';

export const measureVolume = (geometry) => {
  const linear = [];
  linearize(geometry, ['graph'], linear);
  return computeVolume(linear);
};
