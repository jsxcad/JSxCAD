import { computeVolume } from '@jsxcad/algorithm-cgal';
import { hasNotTypeVoid } from './type.js';
import { linearize } from './linearize.js';

const filter = (geometry) => geometry.type === 'graph' && hasNotTypeVoid(geometry);

export const measureVolume = (geometry) => {
  const linear = [];
  linearize(geometry, filter, linear);
  return computeVolume(linear);
};
