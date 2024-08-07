import { approximate as approximateWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const approximate = (geometry, faceCount, minErrorDrop) => {
  const inputs = linearize(geometry, filter);
  const outputs = approximateWithCgal(inputs, faceCount, minErrorDrop);
  return replacer(inputs, outputs)(geometry);
};
