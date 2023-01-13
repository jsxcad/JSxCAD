import {
  approximate as approximateWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) => ['graph'].includes(geometry.type);

export const approximate = (
  geometry,
  iterations,
  relaxationSteps,
  minimumErrorDrop,
  subdivisionRatio,
  relativeToChord,
  withDihedralAngle,
  optimizeAnchorLocation,
  pcaPlane,
  maxNumberOfProxies
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
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
  deletePendingSurfaceMeshes();
  return replacer(inputs, outputs)(concreteGeometry);
};
