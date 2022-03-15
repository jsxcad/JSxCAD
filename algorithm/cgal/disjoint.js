import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { fromCgalGeometry, toCgalGeometry } from './cgalGeometry.js';
import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';

export const disjoint = (inputs) => {
  const g = getCgal();
  // TODO: Merge with the linearization and rewrite phases in geometry/tagged.
  const cgalGeometry = toCgalGeometry(inputs);
  try {
    // These are custom inputs.
    const getIsMasked = (nth) =>
      inputs[nth].tags && inputs[nth].tags.includes('type:masked');
    const status = g.DisjointIncrementally(cgalGeometry, getIsMasked);
    if (status === STATUS_ZERO_THICKNESS) {
      throw new ErrorZeroThickness('Zero thickness produced by disjoint');
    }
    if (status !== STATUS_OK) {
      throw new Error(`Unexpected status ${status}`);
    }
    return fromCgalGeometry(cgalGeometry, inputs);
  } catch (error) {
    console.log(error.stack);
    throw Error(error);
  } finally {
    cgalGeometry.delete();
  }
};
