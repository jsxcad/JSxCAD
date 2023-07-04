import { bend as bendWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const bend = (geometry, radius = 100) => {
  const inputs = linearize(geometry, filter);
  const outputs = bendWithCgal(inputs, radius);
  return replacer(inputs, outputs)(geometry);
};
