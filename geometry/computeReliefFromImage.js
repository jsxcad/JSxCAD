import { computeReliefFromImage as computeReliefFromImageWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';

export const computeReliefFromImage = (
  x,
  y,
  z,
  data,
  angularBound,
  radiusBound,
  distanceBound,
  errorBound,
  extrusion,
  doClose
) => {
  const outputs = computeReliefFromImageWithCgal(
    x,
    y,
    z,
    data,
    angularBound,
    radiusBound,
    distanceBound,
    errorBound,
    extrusion,
    doClose
  );
  return taggedGroup({}, ...outputs);
};
