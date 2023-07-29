import { linearize } from './tagged/linearize.js';
import { remesh as remeshWithCgal } from '@jsxcad/algorithm-cgal';
import { replacer } from './tagged/visit.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const remesh = (
  geometry,
  resolution = 1,
  selections,
  { iterations = 1, relaxationSteps = 1, targetEdgeLength = resolution }
) => {
  const inputs = [];
  linearize(geometry, filter, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter, inputs);
  }
  const outputs = remeshWithCgal(
    inputs,
    count,
    iterations,
    relaxationSteps,
    targetEdgeLength
  );
  return replacer(inputs, outputs)(geometry);
};
