import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const joinSurfaceMeshes = (
  targets,
  sources,
) => {
  const results = [];
  const status = getCgal().JoinSurfaceMeshesIncrementally(
    targets.length,
    (nth) => targets[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(targets[nth].matrix),
    (nth) => targets[nth].isPlanar && targets[nth].isEmpty,
    sources.length,
    (nth) => sources[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(sources[nth].matrix),
    (nth, mesh) => {
      const { matrix, tags } = targets[nth];
      results[nth] = { matrix, mesh, tags };
    }
  );
  if (status === STATUS_ZERO_THICKNESS) {
    throw new ErrorZeroThickness('Zero thickness produced by join');
  }
  if (status !== STATUS_OK) {
    throw new Error(`Unexpected status ${status}`);
  }
  return results;
};
