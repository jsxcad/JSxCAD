import { computeImplicitVolume as computeImplicitVolumeWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';

export const computeImplicitVolume = (
  op,
  radius,
  angularBound,
  radiusBound,
  distanceBound,
  errorBound
) => {
  const outputs = computeImplicitVolumeWithCgal(
    op,
    radius,
    angularBound,
    radiusBound,
    distanceBound,
    errorBound
  );
  return taggedGroup({}, ...outputs);
};
