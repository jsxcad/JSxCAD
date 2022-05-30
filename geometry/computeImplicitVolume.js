import {
  computeImplicitVolume as computeImplicitVolumeWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

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
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};
