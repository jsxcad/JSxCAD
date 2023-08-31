import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { separate as separateWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const separate = (geometry, { noShapes, noHoles, holesAsShapes }) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = separateWithCgal(inputs, !noShapes, !noHoles, holesAsShapes);
  return taggedGroup({}, ...outputs);
};
