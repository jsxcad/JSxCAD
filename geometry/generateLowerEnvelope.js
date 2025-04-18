import { generateEnvelope } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const generateLowerEnvelope = (geometry, modes) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = generateEnvelope(inputs, /* envelopeType= */ 1, modes);
  return replacer(inputs, outputs)(concreteGeometry);
};
