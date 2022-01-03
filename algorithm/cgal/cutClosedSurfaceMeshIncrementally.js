import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cutClosedSurfaceMeshIncrementally = (
  mesh,
  transform,
  check,
  cuts
) => {
  let result;
  const status = getCgal().CutClosedSurfaceMeshIncrementally(
    mesh,
    toCgalTransformFromJsTransform(transform),
    cuts.length,
    check,
    (nth) => cuts[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(cuts[nth].matrix),
    (output) => {
      result = output;
    }
  );
  if (status === STATUS_ZERO_THICKNESS) {
    throw new ErrorZeroThickness('Zero thickness produced by cut');
  }
  if (status !== STATUS_OK) {
    throw new Error(`Unexpected status ${status}`);
  }
  return result;
};
