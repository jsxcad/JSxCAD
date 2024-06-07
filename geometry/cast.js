import { XY } from './Ref.js';
import { cast as castWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filterGeometry = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

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
  linearize(geometry, filterGeometry, inputs, { includeItems: true });
  const outputs = castWithCgal(inputs);
  return replacer(inputs, outputs)(geometry);
};
