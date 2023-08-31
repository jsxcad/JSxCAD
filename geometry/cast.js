import { cast as castWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

export const cast = (planeReference, sourceReference, geometry) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(toConcreteGeometry(planeReference), filterReferences, inputs);
  inputs.length = 1;
  linearize(toConcreteGeometry(sourceReference), filterReferences, inputs);
  inputs.length = 2;
  linearize(concreteGeometry, filter, inputs);
  const outputs = castWithCgal(inputs);
  return taggedGroup({}, ...outputs);
};
