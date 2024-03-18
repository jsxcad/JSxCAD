import { XY } from './Ref.js';
import { cast as castWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

export const cast = (
  planeReference = XY([0]),
  sourceReference = XY([1]),
  geometry
) => {
  const inputs = [];
  linearize(planeReference, filterReferences, inputs);
  inputs.length = 1;
  linearize(sourceReference, filterReferences, inputs);
  inputs.length = 2;
  linearize(geometry, filter, inputs);
  const outputs = castWithCgal(inputs);
  return taggedGroup({}, ...outputs);
};
