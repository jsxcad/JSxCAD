import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';
import { twist as twistWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const twist = (geometry, radius) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = twistWithCgal(inputs, radius);
  return replacer(inputs, outputs)(concreteGeometry);
};
