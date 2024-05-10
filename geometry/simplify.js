import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { simplify as simplifyWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const simplify = (geometry, faceCount, sharpEdgeThreshold) => {
  const inputs = linearize(geometry, filter);
  const outputs = simplifyWithCgal(inputs, faceCount, sharpEdgeThreshold);
  return replacer(inputs, outputs)(geometry);
};
