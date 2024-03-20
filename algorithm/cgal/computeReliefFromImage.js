import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const computeReliefFromImage = (
  x,
  y,
  z,
  data,
  angularBound = 30,
  radiusBound = 1,
  distanceBound = 1,
  errorBound = 1,
  extrusion = 10
) =>
  withCgalGeometry('computeReliefFromImage', [], (cgalGeometry, g) => {
    const cStorage = g._malloc(data.length);
    try {
      const cArray = new Uint8Array(g.HEAPU8.buffer, cStorage, data.length);
      cArray.set(data);
      const status = g.ComputeReliefFromImage(
        cgalGeometry,
        Number(x),
        Number(y),
        Number(z),
        cStorage,
        Number(angularBound),
        Number(radiusBound),
        Number(distanceBound),
        Number(errorBound),
        Number(extrusion)
      );
      switch (status) {
        case STATUS_ZERO_THICKNESS:
          throw new ErrorZeroThickness(
            'Zero thickness produced by computeReliefFromImage'
          );
        case STATUS_OK:
          return fromCgalGeometry(cgalGeometry, [], cgalGeometry.getSize());
        default:
          throw new Error(`Unexpected status ${status}`);
      }
    } finally {
      g._free(cStorage);
    }
  });
