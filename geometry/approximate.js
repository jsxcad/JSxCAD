import { approximate as approximateWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const approximate = (
  geometry,
  {
    iterations,
    relaxationSteps,
    minimumErrorDrop,
    subdivisionRatio,
    relativeToChord,
    withDihedralAngle,
    optimizeAnchorLocation,
    pcaPlane,
    maxNumberOfProxies,
  }
) => {
  const inputs = linearize(geometry, filter);
  const outputs = approximateWithCgal(
    inputs,
    iterations,
    relaxationSteps,
    minimumErrorDrop,
    subdivisionRatio,
    relativeToChord,
    withDihedralAngle,
    optimizeAnchorLocation,
    pcaPlane,
    maxNumberOfProxies
  );
  return replacer(inputs, outputs)(geometry);
};
