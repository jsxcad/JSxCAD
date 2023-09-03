import { demesh as demeshWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const demesh = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = demeshWithCgal(inputs);
  return replacer(inputs, outputs)(concreteGeometry);
};
