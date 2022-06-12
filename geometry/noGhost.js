import { isTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const removeIfGhost = (geometry) =>
  isTypeGhost(geometry) ? taggedGroup({}) : geometry;

export const noGhost = (geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = linearize(concreteGeometry, isTypeGhost);
  const outputs = inputs.map(removeIfGhost);
  return replacer(inputs, outputs)(concreteGeometry);
};
